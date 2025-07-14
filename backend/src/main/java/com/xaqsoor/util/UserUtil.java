package com.xaqsoor.util;

import com.xaqsoor.dto.request.UserCreateRequest;
import com.xaqsoor.entity.Confirmation;
import com.xaqsoor.entity.Role;
import com.xaqsoor.entity.User;
import com.xaqsoor.entity.UserCredential;
import com.xaqsoor.enumeration.ConfirmationType;
import com.xaqsoor.enumeration.MembershipLevel;
import com.xaqsoor.enumeration.Status;
import com.xaqsoor.service.S3Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import static com.xaqsoor.constant.Constant.APP_ZONE;
import static org.apache.commons.lang3.StringUtils.EMPTY;

public class UserUtil {
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy");
    public static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss");

    public static User createNewUser(UserCreateRequest request, String normalizedEmail, Role role) {
        return User.builder()
                .userId("XQ-" + UniqueIdGenerator.generateTimestampBased())
                .firstName(request.firstName())
                .middleName(request.middleName())
                .lastName(request.lastName())
                .gender(request.gender())
                .status(Status.PENDING)
                .membershipLevel(MembershipLevel.SUPPORTER)
                .role(role)
                .email(normalizedEmail)
                .phone(request.phone())
                .networkOperator(request.networkProvider())
                .bio(EMPTY)
                .failedLoginAttempts(0)
                .lastLogin(null)
                .dateOfBirth(null)
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
                .district(request.district())
                .city(request.city())
                .state(request.state())
                .country(request.country())
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

    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        ZonedDateTime zonedDateTime = dateTime.atZone(ZoneId.systemDefault()).withZoneSameInstant(APP_ZONE);
        return FORMATTER.format(zonedDateTime);
    }

    public static String formatDate(LocalDate date) {
        return date != null ? DATE_FORMATTER.format(date) : "";
    }

    public static String resolveProfileImageUrl(String imageKey, S3Service s3Service) {
        return (imageKey != null && !imageKey.isBlank())
                ? s3Service.constructFileUrl(imageKey)
                : "";
    }
}


