package com.xaqsoor.security.service;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

public interface JwtService {
    Optional<String> extractUsernameFromToken(String token);

    <T> Optional<T> extractClaimFromToken(String token, Function<Claims, T> claimsResolver);

    String generateTokenWithClaims(Map<String, Object> extraClaims, String subject, Duration expirationDuration);

    boolean isTokenValidForUser(String token, UserDetails userDetails);

    boolean isTokenExpired(String token);
}
