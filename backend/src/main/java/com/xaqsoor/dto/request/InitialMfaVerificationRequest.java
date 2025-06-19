package com.xaqsoor.dto.request;

public record InitialMfaVerificationRequest(
        String mfaSecret,
        String verificationCode
) {
}
