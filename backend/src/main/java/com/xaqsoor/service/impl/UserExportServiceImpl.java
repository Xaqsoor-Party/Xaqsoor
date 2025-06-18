package com.xaqsoor.service.impl;

import com.xaqsoor.entity.User;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.service.UserExportService;
import com.xaqsoor.util.ExcelExportUtil;
import com.xaqsoor.util.PdfExportUtil;
import com.xaqsoor.util.UserSortUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserExportServiceImpl implements UserExportService {
    private final UserRepository userRepository;

    @Override
    public ByteArrayInputStream exportUsersToExcel(String searchTerm, String statusFilter, String roleFilter, String genderFilter, String membershipLevelFilter,boolean colorCodeRows) throws IOException {
        List<User> users = fetchFilteredUsers(searchTerm, statusFilter, roleFilter, genderFilter, membershipLevelFilter);

        String[] columns = {
                "User ID", "First Name", "Middle Name", "Last Name", "Gender",
                "Date of Birth", "Email", "Phone",
                "Status", "Membership Level", "Role", "Last Login"
        };
        return ExcelExportUtil.usersToExcel(users, columns, colorCodeRows);
    }

    @Override
    public ByteArrayInputStream exportUsersToPdf(String searchTerm, String statusFilter, String roleFilter, String genderFilter, String membershipLevelFilter) throws IOException {
        List<User> users = fetchFilteredUsers(searchTerm, statusFilter, roleFilter, genderFilter, membershipLevelFilter);
        return PdfExportUtil.usersToPdf(users);
    }

    @Override
    public long countUsersByFilters(String searchTerm, String statusFilter, String roleFilter, String genderFilter, String membershipLevelFilter) {
        String status = UserSortUtil.parseStatusFilter(statusFilter);
        String membershipLevel = UserSortUtil.parseMembershipLevelFilter(membershipLevelFilter);
        return userRepository.countUserCardsByFilters(searchTerm, status, roleFilter, genderFilter, membershipLevel);
    }

    private List<User> fetchFilteredUsers(String searchTerm, String statusFilter, String roleFilter, String genderFilter, String membershipLevelFilter) {
        String status = UserSortUtil.parseStatusFilter(statusFilter);
        String membershipLevel = UserSortUtil.parseMembershipLevelFilter(membershipLevelFilter);
        return userRepository.searchUserCardsNativeNoPage(
                searchTerm,
                status,
                roleFilter,
                genderFilter,
                membershipLevel
        );
    }
}