package com.xaqsoor.util;

public record IpInfo(
        String ip,
        String city,
        String region,
        String country,
        String loc,
        String org,
        String timezone
) {
    @Override
    public String toString() {
        return String.format(
                "IP: %s | Location: %s, %s, %s | Coordinates: %s | ISP: %s | Time Zone: %s",
                ip, city, region, country, loc, org, timezone
        );
    }
}
