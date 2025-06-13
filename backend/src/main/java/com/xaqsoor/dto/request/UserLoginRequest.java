package com.xaqsoor.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record UserLoginRequest(
        @Email(message = "Please provide a valid email address")
        @NotEmpty(message = "Email field cannot be left empty")
        String email,

        @NotEmpty(message = "Password field cannot be left empty")
        @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
        String password,

        boolean adminLogin
) {
}
