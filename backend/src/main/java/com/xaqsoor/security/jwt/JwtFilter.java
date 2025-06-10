package com.xaqsoor.security.jwt;

import com.xaqsoor.exception.ApiException;
import com.xaqsoor.security.permission.PermittedResource;
import com.xaqsoor.security.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class JwtFilter extends OncePerRequestFilter {
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final PermittedResource permittedResource;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        if (permittedResource.isPermitted(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = extractJwtToken(request);

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            validateAndProcessToken(request, jwtToken);
        }

        filterChain.doFilter(request, response);

    }

    private String extractJwtToken(HttpServletRequest request) {
        String header = request.getHeader(AUTHORIZATION_HEADER);

        if (header == null || header.isBlank()) {
            throw new ApiException("Missing 'Authorization' header.");
        }

        if (!header.startsWith(BEARER_PREFIX)) {
            throw new ApiException("Invalid token format. Expected 'Bearer <token>'.");
        }

        return header.substring(BEARER_PREFIX.length()).trim();
    }

    private void validateAndProcessToken(HttpServletRequest request, String jwtToken) {
        String userEmail = extractUserEmailFromToken(jwtToken);
        if (userEmail == null) {
            throw new ApiException("Invalid JWT token: Unable to extract user email");
        }

        try {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if (!jwtService.isTokenValidForUser(jwtToken, userDetails)) {
                throw new ApiException("JWT token is invalid for the user: " + userEmail);
            }
            applyTokenToSecurityContext(request, userDetails);
        } catch (UsernameNotFoundException e) {
            throw new UsernameNotFoundException("User not found with email: " + userEmail, e);
        }
    }

    private String extractUserEmailFromToken(String jwtToken) {
        return jwtService.extractUsernameFromToken(jwtToken)
                .orElseThrow(() -> new ApiException("Error extracting user email from token."));
    }

    private void applyTokenToSecurityContext(HttpServletRequest request, UserDetails userDetails) {
        final UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}