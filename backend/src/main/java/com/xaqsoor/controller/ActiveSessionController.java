package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.dto.SessionDto;
import com.xaqsoor.service.ActiveSessionService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class ActiveSessionController {
    private final ActiveSessionService activeSessionService;

    @GetMapping("/{userId}")
    public ResponseEntity<Response> getActiveSessions(@PathVariable Long userId, HttpServletRequest request) {
        List<SessionDto> sessions = activeSessionService.getActiveSessionsByUserId(userId);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("activeSessions", sessions),
                        "Active sessions fetched successfully",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/{userId}/revoke-others")
    public ResponseEntity<Response> revokeOtherSessions(@PathVariable Long userId, HttpServletRequest request) {
        int revokedCount = activeSessionService.revokeOtherSessions(userId, request);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("revokedSessionsCount", revokedCount),
                        "Other active sessions revoked successfully",
                        HttpStatus.OK
                )
        );
    }
}
