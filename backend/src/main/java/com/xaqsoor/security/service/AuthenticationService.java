package com.xaqsoor.security.service;

import com.xaqsoor.dto.request.InitialMfaVerificationRequest;
import com.xaqsoor.dto.request.MfaVerificationRequest;
import com.xaqsoor.dto.request.UserLoginRequest;
import com.xaqsoor.dto.response.AuthenticationResponse;
import com.xaqsoor.dto.response.MfaSetupDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthenticationService {
    AuthenticationResponse login(UserLoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response);

    AuthenticationResponse verifyMfa(MfaVerificationRequest mfaVerificationRequest, HttpServletRequest request, HttpServletResponse response);

    void verifyInitialMfa(String userId,InitialMfaVerificationRequest request);

    MfaSetupDetails setupMfa(String userId);

    void disableMfa(String userId);

    AuthenticationResponse refreshAccessToken(HttpServletRequest request, HttpServletResponse response);

    void logout(HttpServletRequest request, HttpServletResponse response);
}
