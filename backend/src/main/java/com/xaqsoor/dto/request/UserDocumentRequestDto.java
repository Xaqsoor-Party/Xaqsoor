package com.xaqsoor.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserDocumentRequestDto(
        @NotNull(message = "Document type is required")
        String documentType,

        @NotBlank(message = "File storage key is required")
        String fileStorageKey,

        @NotBlank(message = "Country is required")
        @Size(max = 100)
        String country,

        @NotBlank(message = "Document number is required")
        @Size(max = 50)
        String documentNumber,

        @NotNull(message = "Issued date is required")
        LocalDate issuedAt,

        LocalDate expiresAt
) {
}
