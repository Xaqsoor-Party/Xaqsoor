package com.xaqsoor.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private Long createdBy;
    private Long modifiedBy;
    private String userId;
    private String firstName;
    private String middleName;
    private String lastName;
    private String gender;
    private String placeOfBirth;
    private String dateOfBirth;
    private String status;
    private String membershipLevel;
    private String role;
    private String authorities;
    private String email;
    private String phone;
    private String bio;
    private String lastLogin;
    private String profileImageUrl;
    private String createdDate;
    private String modifiedDate;
    private String mfaQrCodeImageUrl;

    private String street;
    private String city;
    private String state;
    private String country;

    private boolean emailVerified;
    private boolean mfaEnabled;
    private boolean accountNonExpired;
    private boolean accountNonLocked;
    private boolean enabled;
}
