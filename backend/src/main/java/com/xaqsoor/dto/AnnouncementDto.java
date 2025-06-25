package com.xaqsoor.dto;

import java.time.LocalDate;

public record AnnouncementDto(
        Long id,
        String title,
        String content,
        LocalDate announcementDate
) {
}
