package com.xaqsoor.dto;

public record UserDocumentDto (
        Long id,
        String documentType,
        String fileUrl,
        boolean verified,
        String rejectionReason,
        String country,
        String documentNumber,
        String issuedAt,
        String expiresAt
) {
}
