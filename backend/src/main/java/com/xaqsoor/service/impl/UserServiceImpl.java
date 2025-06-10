package com.xaqsoor.service.impl;

import com.xaqsoor.dto.request.ChangePasswordRequest;
import com.xaqsoor.dto.request.SetPasswordRequest;
import com.xaqsoor.dto.request.UserCreateRequest;
import com.xaqsoor.dto.response.UserVerificationResponse;
import com.xaqsoor.entity.*;
import com.xaqsoor.enumeration.ConfirmationType;
import com.xaqsoor.enumeration.EventType;
import com.xaqsoor.event.UserEvent;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.projections.ConfirmationProjection;
import com.xaqsoor.repository.ConfirmationRepository;
import com.xaqsoor.repository.RoleRepository;
import com.xaqsoor.repository.UserCredentialRepository;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.service.UserService;
import com.xaqsoor.util.UniqueIdGenerator;
import com.xaqsoor.util.UserUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Map;

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserCredentialRepository credentialRepository;
    private final ConfirmationRepository confirmationRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder encoder;
    private final ApplicationEventPublisher publisher;

    @Override
    public void createUser(UserCreateRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        validateUniqueFields(normalizedEmail,request.phone());

        Role role = getRole(request.roleName());

        User newUser = userRepository.save(UserUtil.createNewUser(request, normalizedEmail,role));

        String tempPassword = UniqueIdGenerator.generateTemporaryPassword();
        UserCredential credential = UserUtil.setTemporaryPassword(newUser, encoder.encode(tempPassword));
        credentialRepository.save(credential);
        confirmationRepository.save(UserUtil.createConfirmation(newUser,ConfirmationType.EMAIL_VERIFICATION,6));
        publisher.publishEvent(new UserEvent(newUser, EventType.REGISTRATION, Map.of("tempPassword",tempPassword)));
    }

    @Override
    public UserVerificationResponse verifyConfirmationKey(String key) {
        ConfirmationProjection confirmation = validateConfirmationKey(key);

        if (confirmation.getType() != ConfirmationType.EMAIL_VERIFICATION) {
            User user = getUserByEmail(confirmation.getEmail());
            user.setEmailVerified(true);
            userRepository.save(user);
        }

        return new UserVerificationResponse(
                confirmation.getEmail(),
                confirmation.getFirstName() + " " + confirmation.getMiddleName() + " " + confirmation.getLastName()
        );
    }

    @Override
    public void handlePasswordSetup(SetPasswordRequest request) {
        ConfirmationProjection confirmation = validateConfirmationKey(request.key());
        User user = getUserByEmail(confirmation.getEmail());
        if (confirmation.getType() == ConfirmationType.EMAIL_VERIFICATION) {
            user.setEmailVerified(true);
            userRepository.save(user);
        }
        credentialRepository.findByUser(user)
                .ifPresentOrElse(
                        credential -> updateExistingCredential(credential, request.password()),
                        () -> createNewCredential(user, request.password())
                );
        confirmationRepository.deleteByKey(request.key());
    }

    @Override
    public void requestPasswordReset(String email) {
        String normalizedEmail = normalizeEmail(email);
        userRepository.findByEmailIgnoreCase(normalizedEmail).ifPresent(user -> {
            long existingPasswordResetRequests = confirmationRepository.countByUserIdAndType(user.getId(), ConfirmationType.PASSWORD_RESET);

            if (existingPasswordResetRequests > 0) {
                confirmationRepository.deleteByUserIdAndType(user.getId(), ConfirmationType.PASSWORD_RESET);
            }
            Confirmation confirmation = createAndSaveConfirmation(user, ConfirmationType.PASSWORD_RESET, 24);
            publisher.publishEvent(new UserEvent(
                    user,
                    EventType.RESET_PASSWORD,
                    Map.of("key", confirmation.getKey())
            ));
        });
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        UserCredential credential = credentialRepository.getCredentialByUserId(userId)
                .orElseThrow(() -> new ApiException("User credentials not found."));

        // Check current password matches stored password
        if (!encoder.matches(request.currentPassword(), credential.getPassword())) {
            throw new ApiException("Current password is incorrect.");
        }

        // Check new password is not reused
        if (isPasswordReused(credential, request.newPassword())) {
            throw new ApiException("Your new password cannot be the same as any of your last 3 passwords. Please choose a different password.");
        }

        updatePasswordHistory(credential);
        String newHashedPassword = encoder.encode(request.newPassword());
        credential.setPassword(newHashedPassword);
        credential.setTemporaryPassword(false);
        credentialRepository.save(credential);
    }

    private void validateUniqueFields(String email, String phone) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException("An account with this email already exists.");
        }
        if (userRepository.existsByPhoneIgnoreCase(phone)) {
            throw new ApiException("An account with this phone number already exists.");
        }
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException("We couldn't process your request. Please try again or contact support."));
    }

    private void updateExistingCredential(UserCredential credential, String newPassword) {
        String newHashedPassword = encoder.encode(newPassword);

        if (isPasswordReused(credential, newPassword)) {
            throw new ApiException("Your new password cannot be the same as any of your last 3 passwords. Please choose a different password.");
        }

        updatePasswordHistory(credential);
        credential.setPassword(newHashedPassword);
        credential.setTemporaryPassword(false);
        credentialRepository.save(credential);
    }

    private void createNewCredential(User user, String password) {
        credentialRepository.save(
                UserCredential.builder()
                        .user(user)
                        .password(encoder.encode(password))
                        .revoked(false)
                        .build()
        );
    }

    private Role getRole(String name) {
        return roleRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new ApiException("Role with name '" + name + "' not found"));
    }

    private Confirmation createAndSaveConfirmation(User user, ConfirmationType type, int expiryInHours) {
        LocalDateTime expiryDate = LocalDateTime.now().plusHours(expiryInHours);

        Confirmation confirmation = new Confirmation(user, type, expiryDate);

        return confirmationRepository.save(confirmation);
    }

    private ConfirmationProjection validateConfirmationKey(String key) {
        ConfirmationProjection confirmation = confirmationRepository.findProjectionByKey(key)
                .orElseThrow(() -> new ApiException("The confirmation link is invalid or has expired."));

        if (confirmation.getExpiryDate().isBefore(LocalDateTime.now())) {
            confirmationRepository.deleteByKey(key);
            throw new ApiException("The confirmation link is invalid or has expired.");
        }

        if (confirmation.getType() != ConfirmationType.EMAIL_VERIFICATION &&
                confirmation.getType() != ConfirmationType.PASSWORD_RESET) {
            throw new ApiException("The confirmation link is not valid for this action.");
        }
        return confirmation;
    }

    private void updatePasswordHistory(UserCredential credential) {
        if (credential.getPassword() == null) return;

        PasswordHistory historyEntry = PasswordHistory.builder()
                .credential(credential)
                .oldPassword(credential.getPassword())
                .build();

        credential.getPasswordHistory().add(historyEntry);

        // Maintain password history size
        if (credential.getPasswordHistory().size() > 3) {
            credential.getPasswordHistory().sort(
                    Comparator.comparing(
                            PasswordHistory::getCreatedDate,
                            Comparator.nullsLast(Comparator.naturalOrder())
                    )
            );
            credential.getPasswordHistory().removeFirst();  // remove the oldest
        }
    }

    private boolean isPasswordReused(UserCredential credential, String rawNewPassword) {

        if (encoder.matches(rawNewPassword, credential.getPassword())) {
            return true;
        }

        // Check historical passwords (last 3)
        return credential.getPasswordHistory().stream()
                .map(PasswordHistory::getOldPassword)
                .anyMatch(oldHash -> encoder.matches(rawNewPassword,oldHash));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
