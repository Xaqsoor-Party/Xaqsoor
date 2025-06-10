package com.xaqsoor.service;

import com.xaqsoor.dto.SessionDto;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface ActiveSessionService {
    List<SessionDto> getActiveSessionsByUserId(Long userId);
    int revokeOtherSessions(Long userId, HttpServletRequest request);
}
