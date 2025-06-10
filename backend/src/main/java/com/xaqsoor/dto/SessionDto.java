package com.xaqsoor.dto;

public record SessionDto(
        Long sessionId,
        String ipAddress,
        String deviceInfo,
        String loginTimestamp
) {}