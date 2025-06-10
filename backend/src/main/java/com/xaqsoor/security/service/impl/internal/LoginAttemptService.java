package com.xaqsoor.security.service.impl.internal;

import com.xaqsoor.cache.CacheStore;
import com.xaqsoor.entity.User;
import com.xaqsoor.enumeration.LoginType;
import com.xaqsoor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private final CacheStore<String, Integer> userCache;
    private final UserRepository userRepository;

    public void handleLoginAttempt(String email, LoginType type) {
        userRepository.findByEmailIgnoreCase(email)
                .ifPresent(user -> handleLoginAttempt(user, type));
    }

    private void handleLoginAttempt(User user, LoginType type) {
        switch (type) {
            case LOGIN_ATTEMPT -> recordFailure(user);
            case LOGIN_SUCCESS -> resetFailures(user);
        }
    }

    private void recordFailure(User user) {
        int attempts = userCache.get(user.getEmail()) != null
                ? userCache.get(user.getEmail()) + 1 : 1;
        user.setFailedLoginAttempts(attempts);
        user.setLoginRestricted(attempts > MAX_FAILED_ATTEMPTS);
        userRepository.save(user);
        userCache.put(user.getEmail(), attempts);
    }

    private void resetFailures(User user) {
        user.setFailedLoginAttempts(0);
        user.setLoginRestricted(false);
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        userCache.evict(user.getEmail());
    }
}
