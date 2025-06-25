package com.xaqsoor.mapper;

import com.xaqsoor.dto.AnnouncementDto;
import com.xaqsoor.entity.Announcement;

public class AnnouncementMapper {

    public static AnnouncementDto toDto(Announcement announcement) {
        if (announcement == null) {
            return null;
        }

        return new AnnouncementDto(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getAnnouncementDate()
        );
    }
}
