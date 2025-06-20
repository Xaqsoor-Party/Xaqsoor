package com.xaqsoor.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(
        @NotBlank(message = "First name is required")
        @Size(max = 15)
        String firstName,

        @Size(max = 15)
        String middleName,

        @NotBlank(message = "Last name is required")
        @Size(max = 15)
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Size(max = 255)
        String email,

        @NotBlank(message = "Phone number is required")
        @Size(max = 15, message = "Phone number must be at most 15 characters")
        String phone,

        @NotBlank(message = "Network provider is required")
        String networkProvider,

        @NotBlank(message = "Gender is required")
        @Pattern(regexp = "^(Male|Female)$", message = "Gender should be one of: Male or Female")
        String gender,

        @NotBlank(message = "Role name is required")
        @Size(max = 30)
        String roleName
) {
        public UserCreateRequest {
                if (roleName == null || roleName.isEmpty()) {
                        roleName = "MEMBER";
                }
        }
}

