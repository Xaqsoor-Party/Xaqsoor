package com.xaqsoor.mapper;

import com.xaqsoor.dto.AnnouncementDto;
import com.xaqsoor.dto.response.AnnouncementRecycleDto;
import com.xaqsoor.entity.Announcement;
import com.xaqsoor.entity.User;
import com.xaqsoor.enumeration.AnnouncementStatus;
import com.xaqsoor.util.UserUtil;

import java.time.LocalDate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class AnnouncementMapper {
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

    public static AnnouncementRecycleDto toRecycleDto(Announcement announcement, User user) {
        String fullName = Stream.of(user.getFirstName(), user.getMiddleName(), user.getLastName())
                .filter(namePart -> namePart != null && !namePart.isBlank())
                .collect(Collectors.joining(" "));

        return new AnnouncementRecycleDto(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                UserUtil.formatDate(announcement.getAnnouncementDate()),
                announcement.getStatus().getValue(),
                announcement.getModifiedBy(),
                fullName,
                UserUtil.formatDateTime(announcement.getModifiedDate())
        );
    }
}
