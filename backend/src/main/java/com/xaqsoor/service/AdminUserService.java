package com.xaqsoor.service;

public interface AdminUserService {
    void resetMfa(String userId);

    void softDeleteUser(Long userId);

    void setUserEnabled(Long userId, boolean enabled);

    void setAccountNonLocked(Long userId, boolean nonLocked);

    void updateUserRole(Long userId, String role);

    void updateMembershipLevel(Long userId, String membershipLevel);

    void updateUserStatus(Long userId, String status);
}
