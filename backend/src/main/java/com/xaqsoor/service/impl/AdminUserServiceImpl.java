package com.xaqsoor.service.impl;

import com.xaqsoor.entity.Role;
import com.xaqsoor.entity.User;
import com.xaqsoor.enumeration.MembershipLevel;
import com.xaqsoor.enumeration.Status;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.repository.RoleRepository;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.security.service.impl.internal.MfaService;
import com.xaqsoor.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {
    private final MfaService mfaService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public void resetMfa(String userId) {
        mfaService.disableMfa(userId);
    }

    @Override
    public void softDeleteUser(Long userId) {
        User user = findActiveUserOrThrow(userId);
        user.setDeleted(true);
        userRepository.save(user);
    }

    @Override
    public void setUserEnabled(Long userId, boolean enabled) {
        User user = findActiveUserOrThrow(userId);
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    @Override
    public void setAccountNonLocked(Long userId, boolean nonLocked) {
        User user = findActiveUserOrThrow(userId);
        user.setAccountNonLocked(nonLocked);
        userRepository.save(user);
    }

    @Override
    public void updateUserRole(Long userId, String roleName) {
        User user = findActiveUserOrThrow(userId);
        Role role = roleRepository.findByNameIgnoreCase(roleName)
                .orElseThrow(() -> new ApiException("Role not found"));
        user.setRole(role);
        userRepository.save(user);
    }

    @Override
    public void updateMembershipLevel(Long userId, String membershipLevel) {
        User user = findActiveUserOrThrow(userId);
        MembershipLevel level = MembershipLevel.fromString(membershipLevel);
        user.setMembershipLevel(level);
        userRepository.save(user);
    }

    @Override
    public void updateUserStatus(Long userId, String status) {
        User user = findActiveUserOrThrow(userId);
        Status statusEnum = Status.fromString(status);
        user.setStatus(statusEnum);
        userRepository.save(user);
    }

    private User findActiveUserOrThrow(Long userId) {
        return userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ApiException("User not found"));
    }

}
