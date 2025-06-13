package com.xaqsoor.mapper;

import com.xaqsoor.dto.UserDto;
import com.xaqsoor.entity.User;

import static com.xaqsoor.util.UserUtil.formatDate;
import static com.xaqsoor.util.UserUtil.formatDateTime;

public class UserMapper {
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
                .dateOfBirth(formatDate(user.getDateOfBirth()))
                .status(user.getStatus().name())
                .membershipLevel(user.getMembershipLevel().getValue())
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
}
