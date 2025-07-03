package com.xaqsoor.mapper;

import com.xaqsoor.dto.UserDto;
import com.xaqsoor.dto.response.UserRecycleDto;
import com.xaqsoor.entity.User;
import com.xaqsoor.util.UserUtil;

import java.util.stream.Collectors;
import java.util.stream.Stream;

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
                .signatureImageUrl(user.getSignatureImageBase64())

                .street(user.getStreet())
                .city(user.getCity())
                .state(user.getState())
                .country(user.getCountry())
                .district(user.getDistrict())

                .emailVerified(user.isEmailVerified())
                .mfaEnabled(user.isMfaEnabled())
                .accountNonExpired(user.isAccountNonExpired())
                .accountNonLocked(user.isAccountNonLocked())
                .enabled(user.isEnabled())
                .build();
    }

    public static UserRecycleDto toRecycleDto(User deletedUser, User deletedByUser) {
        String deletedUserFullName = getFullName(deletedUser);
        String deletedByUserFullName = getFullName(deletedByUser);

        return new UserRecycleDto(
                deletedUser.getId(),
                deletedUserFullName,
                deletedUser.getEmail(),
                deletedUser.getPhone(),
                deletedUser.getRole().getName(),
                deletedUser.getStatus().getValue(),
                deletedByUser.getId(),
                deletedByUserFullName,
                UserUtil.formatDateTime(deletedUser.getModifiedDate())
        );
    }

    private static String getFullName(User user) {
        return Stream.of(
                        user.getFirstName(),
                        user.getMiddleName(),
                        user.getLastName()
                )
                .filter(name -> name != null && !name.isBlank())
                .collect(Collectors.joining(" "));
    }
}
