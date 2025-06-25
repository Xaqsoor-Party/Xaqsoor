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

import java.util.Collections;

@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
public class AnnouncementController {
    private final AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<Response> getAnnouncements(
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize,
            HttpServletRequest request) {

        AnnouncementListDto announcementList = announcementService.getAnnouncements(pageNumber, pageSize);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("announcements", announcementList),
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
                        Collections.singletonMap("announcement", announcement),
                        "Announcement fetched successfully",
                        HttpStatus.OK
                )
        );
    }
}
