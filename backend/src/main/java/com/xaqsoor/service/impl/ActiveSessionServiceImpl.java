package com.xaqsoor.service.impl;

import com.xaqsoor.dto.SessionDto;
import com.xaqsoor.entity.RefreshToken;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.repository.RefreshTokenRepository;
import com.xaqsoor.service.ActiveSessionService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ActiveSessionServiceImpl implements ActiveSessionService {
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public List<SessionDto> getActiveSessionsByUserId(Long userId) {
        List<RefreshToken> activeTokens = refreshTokenRepository
                .findActiveTokensByUserId(userId, LocalDateTime.now());

        return activeTokens.stream()
                .map(token -> new SessionDto(
                        token.getId(),
                        token.getIpAddress(),
                        token.getDeviceInfo(),
                        token.getCreatedDate().toString()
                ))
                .toList();
    }

    @Override
    public int revokeOtherSessions(Long userId,HttpServletRequest request ) {
        String currentRefreshToken = getRefreshTokenFromCookies(request);

        if (currentRefreshToken == null) {
            throw new ApiException("Current session not found.");
        }
        return refreshTokenRepository.revokeAllOtherTokens(userId, currentRefreshToken, LocalDateTime.now());
    }

    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
