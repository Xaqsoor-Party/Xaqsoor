package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.dto.Dashboard.EmailCampaignDashboardDto;
import com.xaqsoor.service.UserCommunicationService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/communications")
@RequiredArgsConstructor
public class UserCommunicationController {
    private final UserCommunicationService userCommunicationService;

    @GetMapping("/operators/count")
    public ResponseEntity<Response> countUsersByNetworkOperator(HttpServletRequest request) {
        Map<String, Long> counts = userCommunicationService.countUsersByNetworkOperator();

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Map.of("operatorCounts", counts),
                        "User counts by network operator retrieved successfully",
                        HttpStatus.OK
                )
        );
    }

    @GetMapping(value = "/phones/export", produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public ResponseEntity<byte[]> exportPhoneAndOperatorCsv(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String operator,
            @RequestParam(required = false) String membershipLevel
    ) throws IOException {

        ByteArrayInputStream in = userCommunicationService.exportPhoneAndOperatorsToCsv(
                status, gender, operator, membershipLevel
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

    @GetMapping("/phones/count")
    public ResponseEntity<Response> countFilteredPhones(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String operator,
            @RequestParam(required = false) String membershipLevel,
            HttpServletRequest request
    ) {

        long count = userCommunicationService.countFilteredUsers(status, gender, operator, membershipLevel);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Map.of("count", count),
                        "Filtered user count retrieved successfully",
                        HttpStatus.OK
                )
        );
    }

    @GetMapping("/emails/dashboard")
    public ResponseEntity<Response> getEmailCampaignDashboard(HttpServletRequest request) {
        EmailCampaignDashboardDto dto = userCommunicationService.getEmailCampaignDashboardData();

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Map.of("emailDashboard", dto),
                        "Email campaign dashboard data retrieved successfully",
                        HttpStatus.OK
                )
        );
    }
}
