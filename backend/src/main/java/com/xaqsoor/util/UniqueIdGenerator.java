package com.xaqsoor.util;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.stream.Collectors;

public class UniqueIdGenerator {
    private static final String LEXICON = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final SecureRandom random = new SecureRandom();
    private static final int TEXT_PART_LENGTH = 4;

    public static String generateTimestampBased() {
        long timestamp = Instant.now().toEpochMilli() % 1_000_000;
        return String.format("%s-%06d-%s",
                generateTextPart(TEXT_PART_LENGTH),
                timestamp,
                generateTextPart(TEXT_PART_LENGTH)
        );
    }

    public static String generateTemporaryPassword() {
        int length = 10;
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            password.append(chars.charAt(index));
        }
        return password.toString();
    }

    private static String generateTextPart(int length) {
        return random.ints(length, 0, LEXICON.length())
                .mapToObj(LEXICON::charAt)
                .map(Object::toString)
                .collect(Collectors.joining());
    }
}
