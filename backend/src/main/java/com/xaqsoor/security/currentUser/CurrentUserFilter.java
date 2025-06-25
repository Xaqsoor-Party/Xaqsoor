package com.xaqsoor.security.currentUser;

import com.xaqsoor.domain.RequestContext;
import com.xaqsoor.security.model.UserDetailsImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

@Component
public class CurrentUserFilter extends OncePerRequestFilter {
    private static final Set<String> PUBLIC_PATH_SUFFIXES = Set.of(
            "/register",
            "/login",
            "/reset-password",
            "/request-password-reset",
            "/verify",
            "/refresh-token",
            "/founders/submit"
    );

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String path = request.getRequestURI();
            boolean isPublicPath = PUBLIC_PATH_SUFFIXES.stream().anyMatch(path::endsWith);
            if (isPublicPath) {
                RequestContext.setUserId(0L);
            } else {
                var authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
                    Long userId = ((UserDetailsImpl) userDetails).getUserId();
                    RequestContext.setUserId(userId);
                }
            }

            filterChain.doFilter(request, response);
        } finally {
            RequestContext.clear();
        }
    }
}
