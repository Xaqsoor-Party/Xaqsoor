package com.xaqsoor.service.impl;

import com.xaqsoor.dto.AnnouncementDto;
import com.xaqsoor.dto.response.AnnouncementListDto;
import com.xaqsoor.entity.Announcement;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.mapper.AnnouncementMapper;
import com.xaqsoor.repository.AnnouncementRepository;
import com.xaqsoor.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AnnouncementServiceImpl implements AnnouncementService {
    private final AnnouncementRepository announcementRepository;

    @Override
    public AnnouncementListDto getAnnouncements(int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        Page<Announcement> announcementPage  = announcementRepository.findAll(pageable);

        List<AnnouncementDto> announcementDtos = announcementPage.stream()
                .map(AnnouncementMapper::toDto)
                .toList();

        return new AnnouncementListDto(
                announcementPage.getTotalElements(),
                pageNumber,
                pageSize,
                announcementDtos
        );
    }

    @Override
    public AnnouncementDto getAnnouncementById(Long id) {
        Optional<Announcement> announcementOpt = announcementRepository.findByIdAndIsDeletedFalse(id);


        return announcementOpt.map(AnnouncementMapper::toDto)
                .orElseThrow(() -> new ApiException("Announcement not found with Id: " + id));
    }
}
