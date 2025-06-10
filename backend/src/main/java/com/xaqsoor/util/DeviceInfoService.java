package com.xaqsoor.util;

import jakarta.servlet.http.HttpServletRequest;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;

public class DeviceInfoService {

    private static final UserAgentAnalyzer userAgentAnalyzer = UserAgentAnalyzer
            .newBuilder()
            .hideMatcherLoadStats()
            .withField(UserAgent.DEVICE_NAME)
            .withField(UserAgent.OPERATING_SYSTEM_NAME)
            .withField(UserAgent.AGENT_NAME)
            .build();

    public static String getDeviceInfo(HttpServletRequest request) {
        String userAgentString = request.getHeader("User-Agent");

        if (userAgentString == null || userAgentString.isEmpty()) {
            return "Unknown device";
        }

        UserAgent agent = userAgentAnalyzer.parse(userAgentString);

        String device = agent.getValue(UserAgent.DEVICE_NAME);
        String os = agent.getValue(UserAgent.OPERATING_SYSTEM_NAME);
        String browser = agent.getValue(UserAgent.AGENT_NAME);

        return String.format("Device: %s, OS: %s, Browser: %s", device, os, browser);
    }
}
