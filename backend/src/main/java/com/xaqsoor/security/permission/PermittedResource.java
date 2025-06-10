package com.xaqsoor.security.permission;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

@Component
public class PermittedResource {

    private final boolean isDevProfile;
    private static final AntPathMatcher PATH_MATCHER = new AntPathMatcher();

    private static final String[] COMMON_PERMITTED_RESOURCES = {
            "/favicon.ico",
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/auth/reset-password",
            "/api/v1/auth/request-password-reset",
            "/api/v1/auth/verify",
            "/api/v1/auth/refresh-token",
    };

    private static final String[] SWAGGER_RESOURCES = {
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
    };

    public PermittedResource(@Value("${spring.profiles.active:}") String activeProfile) {
        this.isDevProfile = "dev".equalsIgnoreCase(activeProfile);
    }

    public boolean isPermitted(String requestUri) {
        for (String permitted : COMMON_PERMITTED_RESOURCES) {
            if (PATH_MATCHER.match(permitted, requestUri)) {
                return true;
            }
        }

        if (isDevProfile) {
            for (String swagger : SWAGGER_RESOURCES) {
                if (PATH_MATCHER.match(swagger, requestUri)) {
                    return true;
                }
            }
        }

        return false;
    }

    public String[] getPermittedResources() {
        if (isDevProfile) {
            String[] combined = new String[COMMON_PERMITTED_RESOURCES.length + SWAGGER_RESOURCES.length];
            System.arraycopy(COMMON_PERMITTED_RESOURCES, 0, combined, 0, COMMON_PERMITTED_RESOURCES.length);
            System.arraycopy(SWAGGER_RESOURCES, 0, combined, COMMON_PERMITTED_RESOURCES.length, SWAGGER_RESOURCES.length);
            return combined;
        }
        return COMMON_PERMITTED_RESOURCES;
    }
}
