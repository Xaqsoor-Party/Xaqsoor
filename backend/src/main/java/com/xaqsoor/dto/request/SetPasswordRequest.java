package com.xaqsoor.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SetPasswordRequest (
        @NotBlank(message = "Confirmation key is required")
        @Size(max = 255, message = "Confirmation key must not exceed 255 characters")
        String key,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
        String password
){}
