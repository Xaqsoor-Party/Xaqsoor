package com.xaqsoor.dto.response;

public record AnnouncementRecycleDto(
        Long id,
        String title,
        String content,
        String announcementDate,
        String status,
        Long deletedByUserId,
        String lastModifiedByName,
        String deletedDate
) {}
