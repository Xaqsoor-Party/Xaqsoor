package com.xaqsoor.security.service.impl;

import com.xaqsoor.security.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String jwtSecret;

    @Override
    public Optional<String> extractUsernameFromToken(String token) {
        return extractClaimFromToken(token, Claims::getSubject);
    }

    @Override
    public <T> Optional<T> extractClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaimsFromToken(token);
        return Optional.ofNullable(claimsResolver.apply(claims));
    }

    @Override
    public String generateTokenWithClaims(Map<String, Object> extraClaims, String subject, Duration expirationDuration) {
        Date now = new Date(System.currentTimeMillis());
        Date expiryDate = new Date(now.getTime() + expirationDuration.toMillis());

        return Jwts.builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getDecodedSigningKey())
                .compact();
    }

    @Override
    public boolean isTokenValidForUser(String token, UserDetails userDetails) {
        final Optional<String> username = extractUsernameFromToken(token);
        return username.isPresent()
                && username.get().equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    @Override
    public boolean isTokenExpired(String token) {
        Date expiration = extractExpirationDateFromToken(token).orElse(new Date());
        return expiration.before(new Date());
    }

    private Optional<Date> extractExpirationDateFromToken(String token) {
        return extractClaimFromToken(token, Claims::getExpiration);
    }

    private SecretKey getDecodedSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims extractAllClaimsFromToken(String token) {
        return Jwts
                .parser()
                .verifyWith(getDecodedSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
