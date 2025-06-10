package com.xaqsoor.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MfaVerificationRequest (
        @NotNull(message = "MFA token is required.")
        @Size(min = 10, max = 255, message = "MFA token must be between 10 and 255 characters.")
        String mfaToken,

        @NotNull(message = "Verification code is required.")
        @Pattern(regexp = "^[0-9]{6}$", message = "Verification code must be a 6-digit number.")
        String verificationCode
) {
}