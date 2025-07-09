package com.xaqsoor.service;

import com.xaqsoor.dto.Dashboard.EmailCampaignDashboardDto;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Map;

public interface UserCommunicationService {
    Map<String, Long> countUsersByNetworkOperator();

    ByteArrayInputStream exportPhoneAndOperatorsToCsv(String status,
                                                        String gender,
                                                        String operator,
                                                        String membershipLevel) throws IOException;

    long countFilteredUsers(String status,
                            String gender,
                            String operator,
                            String membershipLevel);

    EmailCampaignDashboardDto getEmailCampaignDashboardData();
}
