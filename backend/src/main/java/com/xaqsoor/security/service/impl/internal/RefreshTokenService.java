package com.xaqsoor.security.service.impl.internal;

import com.xaqsoor.entity.User;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final UserRepository userRepository;

    public User getAuthenticatedAndValidatedUser(String userId) {
        User user = findUserByUserIdOrThrow(userId);
        validateAccountStatus(user);
        return user;
    }


    private User findUserByUserIdOrThrow(String userId) {
        return userRepository.findByUserIdIgnoreCase(userId).orElseThrow(() -> new ApiException("Invalid email or password. Please try again."));
    }
    private void validateAccountStatus(User user) {
        if (user.isDeleted()) {
            throw new ApiException(
                    "Your account is no longer active. Please contact support for further assistance."
            );
        }

        if (!user.isAccountNonExpired()) {
            throw new ApiException(
                    "Your account has expired due to inactivity or policy changes. Please contact support for assistance."
            );
        }

        if (!user.isEnabled()) {
            throw new ApiException(
                    "Your account has been disabled. " +
                            "This may be due to a violation of our terms of service or a request from you. " +
                            "If you believe this is an error, please contact support@tuitioncenter.com for assistance."
            );
        }

        if (!user.isAccountNonLocked()) {
            throw new ApiException(
                    "Your account has been locked due to security reasons or a violation of our policies. " +
                            "Please contact support at support@tuitioncenter.com to regain access."
            );
        }
    }
}