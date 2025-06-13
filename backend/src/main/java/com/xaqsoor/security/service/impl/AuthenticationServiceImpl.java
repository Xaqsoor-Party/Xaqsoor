package com.xaqsoor.security.service.impl;

import com.xaqsoor.dto.request.MfaVerificationRequest;
import com.xaqsoor.dto.request.UserLoginRequest;
import com.xaqsoor.dto.response.AuthenticationResponse;
import com.xaqsoor.dto.response.UserAuthResponse;
import com.xaqsoor.entity.RefreshToken;
import com.xaqsoor.entity.User;
import com.xaqsoor.entity.UserCredential;
import com.xaqsoor.enumeration.ConfirmationType;
import com.xaqsoor.enumeration.EventType;
import com.xaqsoor.enumeration.LoginStatus;
import com.xaqsoor.event.UserEvent;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.mapper.UserMapper;
import com.xaqsoor.repository.ConfirmationRepository;
import com.xaqsoor.repository.RefreshTokenRepository;
import com.xaqsoor.repository.UserCredentialRepository;
import com.xaqsoor.security.service.AuthenticationService;
import com.xaqsoor.security.service.IpInfoService;
import com.xaqsoor.security.service.JwtService;
import com.xaqsoor.security.service.impl.internal.LoginService;
import com.xaqsoor.security.service.impl.internal.MfaService;
import com.xaqsoor.security.service.impl.internal.RefreshTokenService;
import com.xaqsoor.service.S3Service;
import com.xaqsoor.util.DeviceInfoService;
import com.xaqsoor.util.IpInfo;
import com.xaqsoor.util.UserUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class, noRollbackFor = BadCredentialsException.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    private static final String AUTH_TOKEN_COOKIE_NAME = "auth_token";
    private static final String COOKIE_PATH = "/";
    private static final int COOKIE_MAX_AGE = 24 * 60 * 60; // 1 hour (in seconds)
    private static final long ACCESS_TOKEN_VALIDITY = 15; // 15 minutes
    private static final long REFRESH_TOKEN_VALIDITY = 24 * 60; // 1 hour

    private final LoginService loginService;
    private final UserCredentialRepository credentialRepository;
    private final ConfirmationRepository confirmationRepository;
    private final JwtService jwtService;
    private final S3Service s3Service;
    private final RefreshTokenRepository refreshTokenRepository;
    private final IpInfoService ipInfoService;
    private final MfaService mfaService;
    private final RefreshTokenService refreshTokenService;
    private final ApplicationEventPublisher publisher;

    @Override
    public AuthenticationResponse login(UserLoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
        User user = loginService.authenticateUser(loginRequest);

        if (loginRequest.adminLogin() && user.getRole().getName().equals("MEMBER")) {
            throw new ApiException("Unauthorized access to admin dashboard");
        }

        UserCredential credential = credentialRepository.getCredentialByUserId(user.getId())
                .orElseThrow(() -> new ApiException("Credentials not found for user: " + user.getEmail()));

        if (credential.isTemporaryPassword() || credential.isRevoked()) {
            return generatePasswordUpdateResponse(user.getId());
        }

        if (user.isMfaEnabled()) {
            return handleMfaFlow(user);
        }

        return handleLoginSuccess(user, request, response, false);
    }

    @Override
    public AuthenticationResponse verifyMfa(MfaVerificationRequest mfaVerificationRequest, HttpServletRequest request, HttpServletResponse response) {
        User user = mfaService.verifyMfaCode(mfaVerificationRequest.mfaToken(), mfaVerificationRequest.verificationCode());
        return handleLoginSuccess(user, request, response, false);
    }

    @Override
    public String setupMfa(String userId) {
        return mfaService.setupMfa(userId);
    }

    @Override
    public void disableMfa(String userId) {
        mfaService.disableMfa(userId);
    }

    @Override
    public AuthenticationResponse refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshTokenValue = getRefreshTokenFromCookies(request);

        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            removeAuthCookie(response);
            throw new ApiException("Refresh token is missing. Please log in again.");
        }

        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> {
                    removeAuthCookie(response);
                    return new ApiException("Session is invalid or expired. Please log in again.");
                });

        if (refreshToken.isRevoked() || refreshToken.hasExpired()) {
            refreshTokenRepository.delete(refreshToken);
            removeAuthCookie(response);
            throw new ApiException("Your session has expired. Please log in again.");
        }
        User user = refreshTokenService.getAuthenticatedAndValidatedUser(refreshToken.getUser().getUserId());
        return handleLoginSuccess(user, request, response, true);
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = getRefreshTokenFromCookies(request);
        if (refreshToken != null) {
            refreshTokenRepository.findByToken(refreshToken).ifPresent(refreshTokenRepository::delete);
            removeAuthCookie(response);
        }
    }

    private AuthenticationResponse generatePasswordUpdateResponse(long userId) {
        String confirmationKey = confirmationRepository
                .findValidKeyByUserIdAndType(userId, ConfirmationType.EMAIL_VERIFICATION)
                .orElseThrow(() -> {
                    log.error("Confirmation key not found for a user during account creation.");
                    return new ApiException("Unable to proceed.");
                });
        return new AuthenticationResponse(
                LoginStatus.UPDATE_PASSWORD,
                "Your password requires an update. Please set a new password to continue.",
                confirmationKey,
                null
        );
    }

    private AuthenticationResponse handleMfaFlow(User user) {
        Map<String, Object> claims = createClaims(user, true);
        String verificationToken = generateJwtToken(user.getEmail(), 5, claims);
        return generateMfaRequiredResponse(verificationToken);
    }

    private AuthenticationResponse handleLoginSuccess(User user, HttpServletRequest request, HttpServletResponse response, boolean isRefreshOnly) {
        Map<String, Object> claims = createClaims(user, false);
        String accessToken = generateJwtToken(user.getEmail(), ACCESS_TOKEN_VALIDITY, claims);

        String refreshToken = null;

        if (!isRefreshOnly) {
            refreshToken = generateJwtToken(user.getEmail(), REFRESH_TOKEN_VALIDITY, claims);

            IpInfo ipAddress = getUserIpAddress(request);
            String deviceInfo = DeviceInfoService.getDeviceInfo(request);
            LocalDateTime refreshExpiry = LocalDateTime.now().plusMinutes(REFRESH_TOKEN_VALIDITY);

            saveRefreshToken(user, refreshToken, refreshExpiry, ipAddress.toString(), deviceInfo);
            addAuthCookie(response, refreshToken);

            Map<String, Object> eventData = createEventData(ipAddress, deviceInfo);
            publisher.publishEvent(new UserEvent(
                    user,
                    EventType.LOGIN,
                    eventData
            ));
        }

        String message = isRefreshOnly
                ? "Your session has been successfully refreshed."
                : "Login successful. Welcome back!";

        UserAuthResponse authResponse = UserAuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userDTO(UserMapper.toDTO(user, UserUtil.resolveProfileImageUrl(user.getProfileImageKey(), s3Service)))
                .build();

        return new AuthenticationResponse(LoginStatus.SUCCESS, message,  "", authResponse);
    }

    private AuthenticationResponse generateMfaRequiredResponse( String mfaToken) {
        return new AuthenticationResponse(
                LoginStatus.MFA_REQUIRED,
                "Multi-factor authentication is required. Please verify your identity.",
                mfaToken,
                null
        );
    }

    private Map<String, Object> createClaims(User user, boolean isMfa) {
        Map<String, Object> claims = new HashMap<>();
        if (isMfa) {
            claims.put("mfa_type", "mfa_verify");
        } else {
            claims.put("role", user.getRole().getName());
        }
        return claims;
    }

    private String generateJwtToken(String subject, long validity, Map<String, Object> claims) {
        return jwtService.generateTokenWithClaims(
                claims,
                subject,
                Duration.ofMinutes(validity)
        );
    }

    public IpInfo getUserIpAddress(HttpServletRequest request) {
        return ipInfoService.getLocationInfo(request);
    }

    private Map<String, Object> createEventData(IpInfo ipAddress, String deviceInfo) {
        Map<String, Object> data = new HashMap<>();
        data.put("ipAddress", ipAddress);
        data.put("deviceInfo", deviceInfo);
        return data;
    }

    private void saveRefreshToken(User user, String refreshTokenValue, LocalDateTime expiryDate, String ipAddress, String deviceInfo) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(refreshTokenValue)
                .expiryDate(expiryDate)
                .ipAddress(ipAddress)
                .deviceInfo(deviceInfo)
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
    }

    private void addAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(AUTH_TOKEN_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath(COOKIE_PATH);
        cookie.setMaxAge(COOKIE_MAX_AGE);
        response.addCookie(cookie);
    }

    private void removeAuthCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(AUTH_TOKEN_COOKIE_NAME, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath(COOKIE_PATH);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (AUTH_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}