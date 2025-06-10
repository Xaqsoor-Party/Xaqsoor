package com.xaqsoor.security.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.xaqsoor.security.service.IpInfoService;
import com.xaqsoor.util.IpInfo;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;

@Slf4j
@Service
public class IpInfoServiceImpl implements IpInfoService {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ipInfo.api-token}")
    private String ipInfoApiToken;

    @Override
    public IpInfo getLocationInfo(HttpServletRequest request) {
        String ipAddress = getIpFromRequest(request);

        // Fallback to localhost if the IP address is not valid
        if ("0:0:0:0:0:0:0:1".equals(ipAddress) || "127.0.0.1".equals(ipAddress)) {
            return new IpInfo(ipAddress, "Localhost", "N/A", "N/A", "0.0,0.0", "Local Network", "N/A");
        }

        try {
            URI uri = new URI("https://ipinfo.io/" + ipAddress + "/json?token=" + ipInfoApiToken);
            URL url = uri.toURL();
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                StringBuilder content = new StringBuilder();
                String inputLine;

                while ((inputLine = in.readLine()) != null) {
                    content.append(inputLine);
                }

                JsonNode jsonNode = objectMapper.readTree(content.toString());

                String ip = jsonNode.has("ip") ? jsonNode.get("ip").asText() : "N/A";
                String city = jsonNode.has("city") ? jsonNode.get("city").asText() : "N/A";
                String region = jsonNode.has("region") ? jsonNode.get("region").asText() : "N/A";
                String country = jsonNode.has("country") ? jsonNode.get("country").asText() : "N/A";
                String loc = jsonNode.has("loc") ? jsonNode.get("loc").asText() : "0.0,0.0";
                String org = jsonNode.has("org") ? jsonNode.get("org").asText() : "Unknown";
                String timezone = jsonNode.has("timezone") ? jsonNode.get("timezone").asText() : "N/A";

                return new IpInfo(ip, city, region, country, loc, org, timezone);
            }
        } catch (Exception e) {
            log.error("Failed to retrieve IP information: {}", e.getMessage());
            return getFallbackIpInfo();
        }
    }

    private  String getIpFromRequest(HttpServletRequest request) {
        String[] headers = {"X-Forwarded-For", "Proxy-Client-IP", "WL-Proxy-Client-IP"};
        String ipAddress = null;

        for (String header : headers) {
            ipAddress = request.getHeader(header);
            if (ipAddress != null && !ipAddress.isEmpty() && !"unknown".equalsIgnoreCase(ipAddress)) {
                break;
            }
        }

        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }

        // Handle multiple IPs in X-Forwarded-For
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0];
        }

        return ipAddress;
    }

    private  IpInfo getFallbackIpInfo() {
        return new IpInfo("N/A", "Unknown", "N/A", "N/A", "0.0,0.0", "Unknown", "N/A");
    }
}
