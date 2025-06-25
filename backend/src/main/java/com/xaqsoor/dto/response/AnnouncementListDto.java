package com.xaqsoor.dto.response;

import com.xaqsoor.dto.AnnouncementDto;

import java.util.List;

public record AnnouncementListDto(
        long totalItems,
        int pageNumber,
        int pageSize,
        List<AnnouncementDto> announcements
) {
}
