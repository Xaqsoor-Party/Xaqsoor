package com.xaqsoor.dto.response;

public record MembershipCardDto(
        String userId,
        String fullName,
        String gender,
        String placeOfBirth,
        String membershipLevel,
        String status,
        String profileImageUrl,
        String validUntil,
        String signatureImageBase64,
        String qrCodeUri
) {}