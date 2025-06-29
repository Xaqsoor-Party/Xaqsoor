package com.xaqsoor.mapper;

import com.xaqsoor.dto.AnnouncementDto;
import com.xaqsoor.entity.Announcement;
import com.xaqsoor.enumeration.AnnouncementStatus;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.util.UserUtil;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;


public class AnnouncementMapper {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public static AnnouncementDto toDto(Announcement announcement) {
        if (announcement == null) {
            return null;
        }

        return new AnnouncementDto(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getStatus().getValue(),
                UserUtil.formatDate(announcement.getAnnouncementDate())
        );
    }

    public static Announcement toEntity(AnnouncementDto dto) {
        if (dto == null) {
            return null;
        }

        LocalDate currentDate = LocalDate.now();
        return Announcement.builder()
                .title(dto.title())
                .content(dto.content())
                .announcementDate(currentDate)
                .status(AnnouncementStatus.fromString(dto.status()))
                .build();
    }

}
