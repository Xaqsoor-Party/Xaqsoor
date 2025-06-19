package com.xaqsoor.dto.response;

public record MfaSetupDetails(
        String mfaSecret,
        String qrCodeImageUri
) {
}
