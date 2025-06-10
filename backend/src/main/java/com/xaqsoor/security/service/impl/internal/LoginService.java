package com.xaqsoor.security.service.impl.internal;

import com.xaqsoor.cache.CacheStore;
import com.xaqsoor.dto.request.UserLoginRequest;
import com.xaqsoor.entity.User;
import com.xaqsoor.enumeration.LoginType;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final LoginAttemptService loginAttemptService;
    private final CacheStore<String, Integer> userCache;

    public User authenticateUser(UserLoginRequest loginRequest) {
        String email = normalizeEmail(loginRequest.email());
        User user;
        try {
            user = authenticateAndThrowIfNull(email, loginRequest.password());
            validateLoginAccess(user);
            return user;
        } catch (DisabledException e) {
            throw new ApiException("Your account has been disabled. Please contact support for assistance.");
        } catch (LockedException e) {
            throw new ApiException("Your account is locked due to multiple failed login attempts. Please try again later.");
        } catch (CredentialsExpiredException e) {
            throw new ApiException("Your credentials have expired. Please reset your password to continue.");
        } catch (AuthenticationException e) {
            throw new ApiException("Login failed due to authentication issues. Please try again or contact support.");
        }
    }

    private Optional<User> authenticate(String email, String password) {
        Integer failedAttempts = userCache.get(email);
        if (failedAttempts != null && failedAttempts >= 5) {
            throw new ApiException("Your account has been temporarily locked due to multiple failed login attempts.");
        }
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails userDetails) {
                Optional<User> optionalUser = userRepository.findByEmailIgnoreCase(userDetails.getUsername());
                optionalUser.ifPresent(user -> loginAttemptService.handleLoginAttempt(userDetails.getUsername(), LoginType.LOGIN_SUCCESS));
                return optionalUser;
            }
            return Optional.empty();
        } catch (BadCredentialsException e) {
            loginAttemptService.handleLoginAttempt(email, LoginType.LOGIN_ATTEMPT);
            throw new ApiException("The email or password you entered is incorrect. Please try again.");
        }
    }

    private String normalizeEmail(String email) {
        return email.toLowerCase();
    }

    private User authenticateAndThrowIfNull(String email, String password) {
        Optional<User> optionalUser = authenticate(email, password);
        return optionalUser.orElseThrow(
                () -> new ApiException("The email or password you entered is incorrect. Please try again."));
    }

    private void validateLoginAccess(User user) {
        if (user.isDeleted()) {
            throw new ApiException(
                    "Your account is no longer active. Please contact support for further assistance."
            );
        }

        if (user.isLoginRestricted()) {
            throw new ApiException("Your account has been temporarily locked due to too many failed login attempts. Please try again later.");
        }
    }
}