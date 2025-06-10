package com.xaqsoor.util;

import com.xaqsoor.dto.request.UserCreateRequest;
import com.xaqsoor.entity.Confirmation;
import com.xaqsoor.entity.Role;
import com.xaqsoor.entity.User;
import com.xaqsoor.entity.UserCredential;
import com.xaqsoor.enumeration.ConfirmationType;
import com.xaqsoor.enumeration.Status;

import java.time.LocalDateTime;

import static org.apache.commons.lang3.StringUtils.EMPTY;

public class UserUtil {
    public static User createNewUser(UserCreateRequest request, String normalizedEmail, Role role) {
        return User.builder()
                .userId("XQ-" + UniqueIdGenerator.generateTimestampBased())
                .firstName(request.firstName())
                .middleName(request.middleName())
                .lastName(request.lastName())
                .gender(request.gender())
                .status(Status.PENDING)
                .role(role)
                .email(normalizedEmail)
                .phone(request.phone())
                .bio(EMPTY)
                .failedLoginAttempts(0)
                .lastLogin(null)
                .profileImageKey(EMPTY)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .isLoginRestricted(false)
                .emailVerified(false)
                .enabled(true)
                .mfaEnabled(false)
                .mfaSecret(EMPTY)
                .mfaQrCodeImageUri(EMPTY)
                .street(EMPTY)
                .city(EMPTY)
                .state(EMPTY)
                .country(EMPTY)
                .build();
    }

    public static UserCredential setTemporaryPassword(User user, String encodedPassword) {
        return UserCredential.builder()
                .user(user)
                .password(encodedPassword)
                .revoked(false)
                .isTemporaryPassword(true)
                .build();
    }

    public static Confirmation createConfirmation(User user, ConfirmationType type, int monthsUntilExpiry) {
        LocalDateTime expiry = LocalDateTime.now().plusMonths(monthsUntilExpiry);
        return new Confirmation(user, type, expiry);
    }
}


