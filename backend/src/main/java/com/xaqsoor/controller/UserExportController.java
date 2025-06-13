package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.service.UserExportService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/users/export")
@RequiredArgsConstructor
public class UserExportController {

    private final UserExportService exportUsersToExcel;

    @GetMapping(value = "/excel", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> exportUsersToExcel(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String statusFilter,
            @RequestParam(required = false) String roleFilter,
            @RequestParam(required = false) String genderFilter,
            @RequestParam(required = false) String membershipLevelFilter,
            @RequestParam(required = false, defaultValue = "false") boolean colorCodeRows
    ) throws IOException {

        ByteArrayInputStream in = exportUsersToExcel.exportUsersToExcel(
                searchTerm,
                statusFilter,
                roleFilter,
                genderFilter,
                membershipLevelFilter,
                colorCodeRows
        );

        byte[] bytes = in.readAllBytes();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        String filename = "users_" + timestamp + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(bytes);
    }

    @GetMapping(value = "/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> exportUsersToPdf(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String statusFilter,
            @RequestParam(required = false) String roleFilter,
            @RequestParam(required = false) String genderFilter,
            @RequestParam(required = false) String membershipLevelFilter
    ) throws IOException {

        ByteArrayInputStream in = exportUsersToExcel.exportUsersToPdf(
                searchTerm,
                statusFilter,
                roleFilter,
                genderFilter,
                membershipLevelFilter
        );

        byte[] bytes = in.readAllBytes();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        String filename = "users_" + timestamp + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }

    @GetMapping("/count")
    public ResponseEntity<Response> getFilteredUserCount(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String statusFilter,
            @RequestParam(required = false) String roleFilter,
            @RequestParam(required = false) String genderFilter,
            @RequestParam(required = false) String membershipLevelFilter,
            HttpServletRequest servletRequest) {

        long count = exportUsersToExcel.countUsersByFilters(
                searchTerm, statusFilter, roleFilter, genderFilter, membershipLevelFilter);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        servletRequest,
                        Collections.singletonMap("totalUsers", count),
                        "User count fetched successfully",
                        HttpStatus.OK
                )
        );
    }
}
