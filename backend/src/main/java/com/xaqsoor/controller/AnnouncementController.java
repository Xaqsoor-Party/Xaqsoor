package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.dto.AnnouncementDto;
import com.xaqsoor.dto.response.AnnouncementListDto;
import com.xaqsoor.service.AnnouncementService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
public class AnnouncementController {
    private final AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<Response> searchAnnouncements(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            HttpServletRequest request
    ) {
        AnnouncementListDto announcements = announcementService.searchAnnouncements(keyword, status, pageNumber, pageSize);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Map.of("announcements", announcements),
                        "Announcements fetched successfully",
                        HttpStatus.OK
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getAnnouncementByReferenceId(
            @PathVariable Long id, HttpServletRequest request) {

        AnnouncementDto announcement = announcementService.getAnnouncementById(id);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Map.of("announcement", announcement),
                        "Announcement fetched successfully",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping
    public ResponseEntity<Response> createAnnouncement(@RequestBody AnnouncementDto dto, HttpServletRequest request) {
        AnnouncementDto created = announcementService.createAnnouncement(dto);
        return new ResponseEntity<>(
                RequestUtils.getResponse(
                        request,
                        Map.of("announcement", created),
                        "Announcement created successfully",
                        HttpStatus.CREATED
                ),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response> updateAnnouncement(@PathVariable Long id,
                                                       @RequestBody AnnouncementDto dto,
                                                       HttpServletRequest request) {
        AnnouncementDto updated = announcementService.updateAnnouncement(id, dto);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Map.of("announcement", updated),
                        "Announcement updated successfully",
                        HttpStatus.OK
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteAnnouncement(@PathVariable Long id, HttpServletRequest request) {
        announcementService.softDeleteAnnouncement(id);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        null,
                        "Announcement deleted successfully",
                        HttpStatus.OK
                )
        );
    }
}
