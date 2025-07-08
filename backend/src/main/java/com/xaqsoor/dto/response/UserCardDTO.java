package com.xaqsoor.dto.response;

public record UserCardDTO(
        long userId,
        String fullName,
        String email,
        String phone,
        String profileImageUrl,
        String membershipLevel,
        String status
) {}

