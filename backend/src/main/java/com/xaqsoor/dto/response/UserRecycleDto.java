package com.xaqsoor.dto.response;

public record UserRecycleDto(
        long userId,
        String fullName,
        String email,
        String phone,
        String roleName,
        String status,
        Long deletedByUserId,
        String lastModifiedByName,
        String deletedDate
) {
}
