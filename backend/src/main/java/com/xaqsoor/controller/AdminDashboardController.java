package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.dto.Dashboard.*;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.service.AdminDashboardService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<Response> getDashboardSummary(@RequestParam(defaultValue = "false") boolean forceRefresh,
                                                        HttpServletRequest request) {
        DashboardSummaryDto summary = adminDashboardService.getDashboardSummary(forceRefresh);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("dashboardSummary", summary),
                        "Admin dashboard summary fetched successfully",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/user-growth")
    public ResponseEntity<Response> getUserGrowth(@RequestBody @Valid TimeRangeRequest timeRangeRequest,
                                                  @RequestParam(defaultValue = "false") boolean forceRefresh,
                                                  HttpServletRequest request) {

        if (timeRangeRequest.range() == Range.CUSTOM) {
            if (timeRangeRequest.startDate() == null || timeRangeRequest.endDate() == null) {
                throw new ApiException("Start date and end date must be provided for CUSTOM range.");
            }
            if (!timeRangeRequest.startDate().isBefore(timeRangeRequest.endDate())) {
                throw new ApiException("Start date must be before end date for CUSTOM range.");
            }
        }

        UserGrowthDto userGrowth = adminDashboardService.getUserGrowth(timeRangeRequest, forceRefresh);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("userGrowth", userGrowth),
                        "User growth data fetched successfully",
                        HttpStatus.OK
                )
        );
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<Response> getRecentActivities(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size,
                                                        @RequestParam(defaultValue = "desc") String orderBy,
                                                        HttpServletRequest request) {
        RecentActivityListDto recentActivities = adminDashboardService.getRecentActivities(page, size, orderBy);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("recentActivities", recentActivities),
                        "Recent activities fetched successfully",
                        HttpStatus.OK
                )
        );
    }

    @GetMapping("/system-health")
    public ResponseEntity<Response> getSystemHealthMetrics(@RequestParam(defaultValue = "false") boolean forceRefresh,HttpServletRequest request) {
        SystemHealthDto systemHealthMetrics = adminDashboardService.getSystemHealthMetrics(forceRefresh);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("systemHealth", systemHealthMetrics),
                        "System health metrics fetched successfully",
                        HttpStatus.OK
                )
        );
    }
}
