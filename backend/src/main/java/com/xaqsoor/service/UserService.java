package com.xaqsoor.service;


import com.xaqsoor.dto.request.ChangePasswordRequest;
import com.xaqsoor.dto.request.SetPasswordRequest;
import com.xaqsoor.dto.request.UserCreateRequest;
import com.xaqsoor.dto.response.UserVerificationResponse;

public interface UserService {
    void createUser(UserCreateRequest request);
    UserVerificationResponse verifyConfirmationKey(String key);
    void handlePasswordSetup(SetPasswordRequest request);
    void requestPasswordReset(String email);
    void changePassword(Long userId, ChangePasswordRequest request);
}
