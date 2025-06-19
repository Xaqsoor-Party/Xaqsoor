package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.dto.request.*;
import com.xaqsoor.dto.response.AuthenticationResponse;
import com.xaqsoor.dto.response.MfaSetupDetails;
import com.xaqsoor.dto.response.UserVerificationResponse;
import com.xaqsoor.security.service.AuthenticationService;
import com.xaqsoor.service.UserService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
public class UserController {
    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Response> register(@RequestBody @Valid UserCreateRequest user, HttpServletRequest request) {
        userService.createUser(user);
        return ResponseEntity.created(getUri()).body(
                RequestUtils.getResponse(
                        request,
                        Collections.emptyMap(),
                        "Welcome to Xaqsoor! Your account has been created successfully. Please check your email for your login details and next steps to complete your profile.",
                        HttpStatus.CREATED
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<Response> login(
            @RequestBody @Valid UserLoginRequest loginRequest,
            HttpServletRequest request, HttpServletResponse response) {

        AuthenticationResponse authStepResponse = authenticationService.login(loginRequest, request, response);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("loginStatus", authStepResponse.loginStatus().name());
        responseData.put("securityToken", authStepResponse.securityToken());
        var userAuthResponse = authStepResponse.userAuthResponse();
        if (userAuthResponse != null) {
            responseData.put("accessToken", userAuthResponse.getAccessToken());
            responseData.put("userDTO", userAuthResponse.getUserDTO());
        } else {
            responseData.put("accessToken", null);
            responseData.put("userDTO", null);
        }

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        responseData,
                        authStepResponse.message(),
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/verify-mfa")
    public ResponseEntity<Response> verifyMfa(@RequestBody @Valid MfaVerificationRequest mfaVerificationRequest,
                                              HttpServletRequest request,
                                              HttpServletResponse response) {
        AuthenticationResponse authStepResponse = authenticationService.verifyMfa(mfaVerificationRequest, request, response);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("loginStatus", authStepResponse.loginStatus().name());
        responseData.put("accessToken", authStepResponse.userAuthResponse().getAccessToken());
        responseData.put("userDTO", authStepResponse.userAuthResponse().getUserDTO());
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        responseData,
                        authStepResponse.message(),
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/mfa/verify-initial")
    public ResponseEntity<Response> verifyInitialMfa(
            @RequestParam String userId,
            @RequestBody @Valid InitialMfaVerificationRequest mfaVerificationRequest,
            HttpServletRequest request) {

        authenticationService.verifyInitialMfa(userId, mfaVerificationRequest);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.emptyMap(),
                        "Initial MFA verification successful.",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/mfa/setup")
    public ResponseEntity<Response> setupMfa(@RequestParam String userId,
                                             HttpServletRequest request) {
        MfaSetupDetails mfaSetupDetails = authenticationService.setupMfa(userId);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("mfaSetupDetails", mfaSetupDetails),
                        "MFA setup initiated.",
                        HttpStatus.OK
                )
        );
    }

    @DeleteMapping("/mfa/disable")
    public ResponseEntity<Response> disableMfa(@RequestParam String userId,
                                               HttpServletRequest request) {
        authenticationService.disableMfa(userId);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.emptyMap(),
                        "MFA disabled successfully.",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Response> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        AuthenticationResponse authStepResponse = authenticationService.refreshAccessToken(request, response);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("accessToken", authStepResponse.userAuthResponse().getAccessToken());
        responseData.put("userDTO", authStepResponse.userAuthResponse().getUserDTO());
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        responseData,
                        "Token refreshed successfully.",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Response> logout(HttpServletRequest request, HttpServletResponse response) {
        authenticationService.logout(request, response);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.emptyMap(),
                        "Logged out successfully.",
                        HttpStatus.OK
                )
        );
    }

    @GetMapping("/verify")
    public ResponseEntity<Response> verifyConfirmationKey(@RequestParam String key, HttpServletRequest request) {
        UserVerificationResponse result = userService.verifyConfirmationKey(key);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("user", result),
                        "Your confirmation key has been verified successfully.",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Response> resetPassword(@RequestBody @Valid SetPasswordRequest request, HttpServletRequest servletRequest) {
        userService.handlePasswordSetup(request);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        servletRequest,
                        Collections.emptyMap(),
                        "Your password has been set successfully. You can now log in using your new password.",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<Response> requestPasswordReset(@RequestParam String email, HttpServletRequest servletRequest) {
        userService.requestPasswordReset(email);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        servletRequest,
                        Collections.emptyMap(),
                        "If the email is registered, a password reset link has been sent.",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<Response> changePassword(
            @PathVariable Long userId,
            @RequestBody @Valid ChangePasswordRequest changePasswordRequest,
            HttpServletRequest request) {

        userService.changePassword(userId, changePasswordRequest);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.emptyMap(),
                        "Password changed successfully.",
                        HttpStatus.OK
                )
        );
    }

    private URI getUri() {
        return URI.create("/api/v1/auth");
    }
}
