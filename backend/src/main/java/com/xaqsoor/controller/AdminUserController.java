package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.service.AdminUserService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @PostMapping("/{userId}/reset-mfa")
    public ResponseEntity<Response> resetMfa(@PathVariable String userId, HttpServletRequest request) {
        adminUserService.resetMfa(userId);
        return ResponseEntity.ok(
                RequestUtils.getResponse(request, null, "MFA reset successfully", HttpStatus.OK)
        );
    }

    @DeleteMapping("/{userId}/soft-delete")
    public ResponseEntity<Response> softDeleteUser(@PathVariable Long userId, HttpServletRequest request) {
        adminUserService.softDeleteUser(userId);
        return ResponseEntity.ok(
                RequestUtils.getResponse(request, null, "User soft-deleted successfully", HttpStatus.OK)
        );
    }

    @PatchMapping("/{userId}/enabled")
    public ResponseEntity<Response> setUserEnabled(
            @PathVariable Long userId,
            @RequestParam boolean enabled,
            HttpServletRequest request
    ) {
        adminUserService.setUserEnabled(userId, enabled);
        return ResponseEntity.ok(
                RequestUtils.getResponse(request,null, "User enabled status updated", HttpStatus.OK)
        );
    }

    @PatchMapping("/{userId}/lock")
    public ResponseEntity<Response> setAccountNonLocked(
            @PathVariable Long userId,
            @RequestParam boolean nonLocked,
            HttpServletRequest request
    ) {
        adminUserService.setAccountNonLocked(userId, nonLocked);
        return ResponseEntity.ok(
                RequestUtils.getResponse(request, null, "User lock status updated", HttpStatus.OK)
        );
    }

    @PatchMapping("/{userId}/role")
    public ResponseEntity<Response> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String role,
            HttpServletRequest request
    ) {
        adminUserService.updateUserRole(userId, role);
        return ResponseEntity.ok(
                RequestUtils.getResponse(request, null, "User role updated", HttpStatus.OK)
        );
    }

    @PatchMapping("/{userId}/membership-level")
    public ResponseEntity<Response> updateMembershipLevel(
            @PathVariable Long userId,
            @RequestParam String membershipLevel,
            HttpServletRequest request
    ) {
        adminUserService.updateMembershipLevel(userId, membershipLevel);
        return ResponseEntity.ok(
                RequestUtils.getResponse(request, null, "Membership level updated", HttpStatus.OK)
        );
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<Response> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam String status,
            HttpServletRequest request
    ) {
        adminUserService.updateUserStatus(userId, status);
        return ResponseEntity.ok(
                RequestUtils.getResponse(request, null, "User status updated", HttpStatus.OK)
        );
    }
}
