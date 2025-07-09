package com.xaqsoor.service.impl;

import com.xaqsoor.dto.Dashboard.EmailCampaignDashboardDto;
import com.xaqsoor.entity.User;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.service.UserCommunicationService;
import com.xaqsoor.util.ExcelExportUtil;
import com.xaqsoor.util.UserSortUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserCommunicationServiceImpl implements UserCommunicationService {
    private final UserRepository userRepository;

    @Override
    public Map<String, Long> countUsersByNetworkOperator() {
        return userRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(User::getNetworkOperator, Collectors.counting()));
    }

    @Override
    public ByteArrayInputStream exportPhoneAndOperatorsToCsv(String status, String gender, String operator, String membershipLevel) throws IOException {
        List<User> users = fetchFilteredUsers(status, gender, operator, membershipLevel);

        String[] columns = {
                "Full Name",
                "Phone Number",
                "Network Operator"
        };

        return ExcelExportUtil.exportBasicUserInfo(users, columns);
    }

    @Override
    public long countFilteredUsers(String status, String gender, String operator, String membershipLevel)  {
        String parsedStatus = UserSortUtil.parseStatusFilter(status);
        String parsedMembership = UserSortUtil.parseMembershipLevelFilter(membershipLevel);
        return userRepository.countUsersByFiltersNative(
                parsedStatus,
                gender,
                operator,
                parsedMembership
        );
    }

    @Override
    public EmailCampaignDashboardDto getEmailCampaignDashboardData() {
        long verifiedEmails = userRepository.countVerifiedEmails();
        long unverifiedEmails = userRepository.countUnverifiedEmails();
        long deletedEmails = userRepository.countDeletedEmails();

        List<Object[]> domainResult = userRepository.getEmailDomainCounts();
        Map<String, Long> domainCounts = new HashMap<>();
        for (Object[] row : domainResult) {
            String domain = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            domainCounts.put(domain, count);
        }

        return new EmailCampaignDashboardDto(
                verifiedEmails,
                unverifiedEmails,
                deletedEmails,
                domainCounts
        );
    }

    private List<User> fetchFilteredUsers(String statusFilter, String genderFilter, String operatorFilter, String membershipLevelFilter) {
        String status = UserSortUtil.parseStatusFilter(statusFilter);
        String membershipLevel = UserSortUtil.parseMembershipLevelFilter(membershipLevelFilter);
        return userRepository.findUsersByFiltersNative(
                status,
                genderFilter,
                operatorFilter,
                membershipLevel
        );
    }

}