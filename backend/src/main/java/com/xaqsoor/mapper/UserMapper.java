package com.xaqsoor.mapper;

import com.xaqsoor.dto.UserDto;
import com.xaqsoor.entity.User;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class UserMapper {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss");
    public static UserDto toDTO(User user, String profileImageUrl) {
        return UserDto.builder()
                .id(user.getId())
                .createdBy(user.getCreatedBy())
                .modifiedBy(user.getModifiedBy())
                .userId(user.getUserId())
                .firstName(user.getFirstName())
                .middleName(user.getMiddleName())
                .lastName(user.getLastName())
                .gender(user.getGender())
                .placeOfBirth(user.getPlaceOfBirth())
                .dateOfBirth(formatDateTime(user.getDateOfBirth()))
                .status(user.getStatus().name())
                .bio(user.getBio())
                .role(user.getRole().getName())
                .authorities(user.getRole().getAuthorities().getValue())
                .email(user.getEmail())
                .phone(user.getPhone())
                .lastLogin(formatDateTime(user.getLastLogin()))
                .profileImageUrl(profileImageUrl)
                .createdDate(formatDateTime(user.getCreatedDate()))
                .modifiedDate(formatDateTime(user.getModifiedDate()))
                .mfaQrCodeImageUrl(user.getMfaQrCodeImageUri())

                .street(user.getStreet())
                .city(user.getCity())
                .state(user.getState())
                .country(user.getCountry())

                .emailVerified(user.isEmailVerified())
                .mfaEnabled(user.isMfaEnabled())
                .accountNonExpired(user.isAccountNonExpired())
                .accountNonLocked(user.isAccountNonLocked())
                .enabled(user.isEnabled())
                .build();
    }

    private static String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? FORMATTER.format(dateTime) : "";
    }
}
