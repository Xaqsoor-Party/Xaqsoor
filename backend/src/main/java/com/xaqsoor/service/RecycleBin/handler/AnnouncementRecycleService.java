package com.xaqsoor.service.RecycleBin.handler;

import com.xaqsoor.dto.response.AnnouncementRecycleDto;
import com.xaqsoor.dto.response.RecycleItemsResponse;
import com.xaqsoor.entity.Announcement;
import com.xaqsoor.entity.User;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.mapper.AnnouncementMapper;
import com.xaqsoor.repository.AnnouncementRepository;
import com.xaqsoor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementRecycleService implements RecyclableEntityService {
    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    @Override
    public RecycleItemsResponse getDeletedItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "modifiedDate"));
        Page<Announcement> announcements = announcementRepository.findAllByIsDeletedTrue(pageable);

        List<AnnouncementRecycleDto> announcementDtos = announcements.stream()
                .map(announcement -> {
                    Long deletedByUserId = announcement.getCreatedBy();
                    User user = userRepository.findById(deletedByUserId)
                            .orElseThrow(() -> new ApiException("User not found for ID " + deletedByUserId));
                    return AnnouncementMapper.toRecycleDto(announcement, user);
                })
                .collect(Collectors.toList());


        return new RecycleItemsResponse(
                (int) announcements.getTotalElements(),
                page,
                size,
                "announcement",
                announcementDtos
        );
    }

    @Override
    public void restore(Long id) {
        Announcement announcement = announcementRepository.findByIdAndIsDeletedTrue(id)
                .orElseThrow(() -> new ApiException(
                        "Restore failed: No deleted announcement found with ID " + id + ". " +
                                "Make sure the announcement exists and is marked as deleted."
                ));

        announcement.setDeleted(false);
        announcementRepository.save(announcement);
    }

    @Override
    public void permanentlyDelete(Long id) {
        boolean exists = announcementRepository.existsByIdAndIsDeletedTrue(id);

        if (!exists) {
            throw new ApiException(
                    "Permanent delete failed: No deleted announcement found with ID " + id +
                            ". Ensure the announcement exists and is marked as deleted."
            );
        }

        announcementRepository.deleteById(id);
    }
}
