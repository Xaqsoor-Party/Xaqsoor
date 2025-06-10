package com.xaqsoor.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.xaqsoor.enumeration.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = {@UniqueConstraint(name = "account_email_unique", columnNames = "email")})
public class User extends Auditable {
    @Column(name = "user_id", nullable = false, unique = true, updatable = false)
    private String userId;

    @Column(name = "first_name", nullable = false, length = 15)
    private String firstName;

    @Column(name = "middle_name", nullable = false, length = 15)
    private String middleName;

    @Column(name = "last_name", nullable = false , length = 15)
    private String lastName;

    @Column(name = "gender", length = 10, nullable = false)
    private String gender;

    @Column(name = "place_of_birth" , length = 50)
    private String placeOfBirth;

    @Column(name = "date_of_birth")
    private LocalDateTime dateOfBirth;

    @Column(name = "status", nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", referencedColumnName = "id", nullable = false)
    private Role role;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone", length = 15, nullable = false, unique = true)
    private String phone;

    @Column(name = "bio", length = 500)
    private String bio;

    @Column(name = "failed_login_attempts", nullable = false)
    private Integer failedLoginAttempts = 0;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "profile_image_key")
    private String profileImageKey;

    @Column(name = "account_non_expired", nullable = false)
    private boolean accountNonExpired = true;

    @Column(name = "account_non_locked", nullable = false)
    private boolean accountNonLocked = true;

    @Column(name = "is_login_restricted", nullable = false)
    private boolean isLoginRestricted = false;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "mfa_enabled", nullable = false)
    private boolean mfaEnabled = false;

    @JsonIgnore
    @Column(name = "mfa_secret")
    private String mfaSecret;

    @Column(name = "mfa_qr_code_image_uri", columnDefinition = "TEXT")
    private String mfaQrCodeImageUri;

    @Column(name = "street", length = 200)
    private String street;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "country", length = 100)
    private String country;
}