package com.xaqsoor.service;

import com.xaqsoor.dto.AnnouncementDto;
import com.xaqsoor.dto.response.AnnouncementListDto;

public interface AnnouncementService {
    AnnouncementListDto getAnnouncements(int pageNumber, int pageSize);
    AnnouncementDto getAnnouncementById(Long id);
}
