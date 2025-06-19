package com.xaqsoor.security.service.impl.internal;

import com.xaqsoor.dto.response.MfaSetupDetails;
import com.xaqsoor.entity.User;
import com.xaqsoor.enumeration.LoginType;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.security.service.JwtService;
import com.xaqsoor.util.MfaUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.apache.commons.lang3.StringUtils.EMPTY;

@Service
@RequiredArgsConstructor
@Slf4j
public class MfaService {
    private final UserRepository userRepository;
    private final LoginAttemptService loginAttemptService;
    private final MfaUtil mfaUtil;
    private final JwtService jwtService;

    public User verifyMfaCode(String mfaToken, String verificationCode) {
        String email = jwtService.extractUsernameFromToken(mfaToken).orElseThrow(() -> new ApiException("Invalid token."));

        jwtService.extractClaimFromToken(mfaToken, claims -> "mfa_verify".equals(claims.get("mfa_type")))
                .orElseThrow(() -> new ApiException("Invalid MFA token."));

        User user = getUserEntityByEmail(email);
        validateLoginAccess(user);

        if (!mfaUtil.verifyCode(user.getMfaSecret(), verificationCode)) {
            loginAttemptService.handleLoginAttempt(email, LoginType.LOGIN_ATTEMPT);
            throw new BadCredentialsException("Invalid verification code.");
        }
        return user;
    }

    public MfaSetupDetails setupMfa(String userId) {
        User user = getUserEntityByUserId(userId);

        if (user.isMfaEnabled()) {
            throw new ApiException("MFA is already enabled for this user.");
        }

        String secret = mfaUtil.generateSecret();
        String qrCodeImageUri = mfaUtil.generateQrCodeImageUri(user.getEmail(), secret);

        return new MfaSetupDetails(secret, qrCodeImageUri);
    }

    public void confirmMfaSetup(String userId, String mfaSecret, String verificationCode) {
        User user = getUserEntityByUserId(userId);

        if (user.isMfaEnabled()) {
            throw new ApiException("MFA is already enabled for this user.");
        }

        if (!mfaUtil.verifyCode(mfaSecret, verificationCode)) {
            throw new BadCredentialsException("Invalid verification code. MFA setup failed.");
        }

        user.setMfaEnabled(true);
        user.setMfaSecret(mfaSecret);

        user.setMfaQrCodeImageUri(mfaUtil.generateQrCodeImageUri(user.getEmail(), mfaSecret));
        userRepository.save(user);
    }

    public void disableMfa(String userId) {
        User user = getUserEntityByUserId(userId);

        if (!user.isMfaEnabled()) {
            throw new ApiException("MFA is already disabled.");
        }

        user.setMfaEnabled(false);
        user.setMfaSecret(EMPTY);
        user.setMfaQrCodeImageUri(EMPTY);
        userRepository.save(user);
    }

    private User getUserEntityByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isEmpty()) {
            log.info("User with email {} not found!!", email);
            throw new ApiException("User not found");
        }
        return userOpt.get();
    }

    private User getUserEntityByUserId(String userId) {
        return userRepository.findByUserIdIgnoreCase(userId)
                .orElseThrow(() -> new ApiException("User not found."));
    }

    private void validateLoginAccess(User user) {
        if (user.isDeleted()) {
            throw new ApiException(
                    "Your account is no longer active. Please contact support for further assistance."
            );
        }
        if (user.isLoginRestricted()) {
            throw new ApiException("Your account has been temporarily locked due to too many failed login attempts. Please try again later.");
        }
        if (!user.isMfaEnabled()) {
            throw new ApiException("Multi-factor authentication (MFA) is required but not enabled for your account.");
        }
    }
}
