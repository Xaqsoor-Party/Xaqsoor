package com.xaqsoor.dto;

public record AnnouncementDto(
        Long id,
        String title,
        String content,
        String status,
        String announcementDate
) {
}
