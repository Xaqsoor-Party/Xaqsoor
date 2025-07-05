package com.xaqsoor.service.impl;

import com.xaqsoor.dto.AnnouncementDto;
import com.xaqsoor.dto.response.AnnouncementListDto;
import com.xaqsoor.entity.Announcement;
import com.xaqsoor.enumeration.AnnouncementStatus;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
@Transactional(rollbackFor = { Exception.class })
public class AnnouncementServiceImpl implements AnnouncementService {
    private final AnnouncementRepository announcementRepository;

    @Override
    public AnnouncementListDto searchAnnouncements(String keyword, String status, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber - 1, pageSize);
        AnnouncementStatus announcementStatus = null;
        if (status != null && !status.isBlank()) {
            announcementStatus = AnnouncementStatus.fromString(status);
        }

        Page<Announcement> page = announcementRepository.searchAnnouncements(keyword == null ? "" : keyword, announcementStatus, pageable);

        List<AnnouncementDto> dtos = page.stream()
                .map(AnnouncementMapper::toDto)
                .toList();
        return new AnnouncementListDto(
                page.getTotalElements(),
                page.getNumber(),
                page.getSize(),
                dtos
        );
    }

    @Override
    public AnnouncementDto getAnnouncementById(Long id) {
        Optional<Announcement> announcementOpt = announcementRepository.findByIdAndIsDeletedFalse(id);


        return announcementOpt.map(AnnouncementMapper::toDto)
                .orElseThrow(() -> new ApiException("Announcement not found with Id: " + id));
    }

    @Override
    public AnnouncementDto createAnnouncement(AnnouncementDto announcementDto) {
        Announcement announcement = AnnouncementMapper.toEntity(announcementDto);
        Announcement saved = announcementRepository.save(announcement);
        return AnnouncementMapper.toDto(saved);
    }

    @Override
    public AnnouncementDto updateAnnouncement(Long id, AnnouncementDto dto) {
        Announcement existing = getNonDeletedAnnouncementById(id);

        existing.setTitle(dto.title());
        existing.setContent(dto.content());
        existing.setStatus(AnnouncementStatus.fromString(dto.status()));

        Announcement updated = announcementRepository.save(existing);
        return AnnouncementMapper.toDto(updated);
    }

    @Override
    public void softDeleteAnnouncement(Long id) {
        Announcement announcement = getNonDeletedAnnouncementById(id);
        announcement.setDeleted(true);
        announcementRepository.save(announcement);
    }

    private Announcement getNonDeletedAnnouncementById(Long id) {
        return announcementRepository.findById(id)
                .filter(a -> !a.isDeleted())
                .orElseThrow(() -> new ApiException("Announcement not found or already deleted"));
    }

}
