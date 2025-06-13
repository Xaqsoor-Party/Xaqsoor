package com.xaqsoor.util;

import com.xaqsoor.enumeration.MembershipLevel;
import com.xaqsoor.enumeration.Status;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;

public class UserSortUtil {
    private static final Set<String> VALID_ORDER_BY_OPTIONS = Set.of(
            "createdDateAsc",
            "createdDateDesc",
            "firstNameAsc",
            "firstNameDesc",
            "emailAsc",
            "emailDesc",
            "lastLoginAsc",
            "lastLoginDesc"
    );

    public static boolean isValidOrderBy(String orderBy) {
        return VALID_ORDER_BY_OPTIONS.contains(orderBy.trim());
    }

    public static Pageable createPageable(int pageNumber, int pageSize, String orderBy) {
        Sort sort;
        switch (orderBy) {
            case "createdDateAsc" -> sort = Sort.by("created_date").ascending();
            case "firstNameAsc" -> sort = Sort.by("first_name").ascending();
            case "firstNameDesc" -> sort = Sort.by("first_name").descending();
            case "emailAsc" -> sort = Sort.by("email").ascending();
            case "emailDesc" -> sort = Sort.by("email").descending();
            case "lastLoginAsc" -> sort = Sort.by("last_login").ascending();
            case "lastLoginDesc" -> sort = Sort.by("last_login").descending();
            default -> sort = Sort.by("created_date").descending();
        }
        return PageRequest.of(pageNumber, pageSize, sort);
    }

    public static String parseStatusFilter(String statusFilter) {
        if (statusFilter != null && !statusFilter.trim().isEmpty()) {
            return Status.fromString(statusFilter).name();
        }
        return null;
    }

    public static String parseMembershipLevelFilter(String membershipLevelFilter) {
        if (membershipLevelFilter != null && !membershipLevelFilter.trim().isEmpty()) {
            return MembershipLevel.fromString(membershipLevelFilter).name();
        }
        return null;
    }
}
