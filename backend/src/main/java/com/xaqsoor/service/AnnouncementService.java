package com.xaqsoor.service;

import com.xaqsoor.dto.AnnouncementDto;
import com.xaqsoor.dto.response.AnnouncementListDto;

public interface AnnouncementService {
    AnnouncementListDto searchAnnouncements(String keyword, String status, int pageNumber, int pageSize);
    AnnouncementDto getAnnouncementById(Long id);
    AnnouncementDto createAnnouncement(AnnouncementDto announcementDto);
    AnnouncementDto updateAnnouncement(Long id, AnnouncementDto announcementDto);
    void softDeleteAnnouncement(Long id);
}
