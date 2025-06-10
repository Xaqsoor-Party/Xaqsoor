package com.xaqsoor.util;

import dev.samstevens.totp.code.*;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import dev.samstevens.totp.time.TimeProvider;
import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Component;

@Component
public class MfaUtil {
    private static final int SECRET_LENGTH = 32;

    public String generateSecret() {
        SecretGenerator generator = new DefaultSecretGenerator(SECRET_LENGTH);
        return generator.generate();
    }

    public String generateQrCodeImageUri(String email, String secret) {
        QrData data = new QrData.Builder()
                .label("Xaqsoor: " + email)
                .secret(secret)
                .issuer("Asal Authentication Service")
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6)
                .period(30)
                .build();

        QrGenerator qrGenerator = new ZxingPngQrGenerator();
        try {
            byte[] imageData = qrGenerator.generate(data);
            return "data:image/png;base64," + Base64.encodeBase64String(imageData);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    public boolean verifyCode(String secret, String code) {
        TimeProvider timeProvider = new SystemTimeProvider();
        CodeGenerator codeGenerator = new DefaultCodeGenerator(HashingAlgorithm.SHA1);
        CodeVerifier verifier = new DefaultCodeVerifier(codeGenerator, timeProvider);
        return verifier.isValidCode(secret, code);
    }
}