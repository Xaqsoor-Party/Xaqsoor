package com.xaqsoor.security.service;


import com.xaqsoor.util.IpInfo;
import jakarta.servlet.http.HttpServletRequest;

public interface IpInfoService {
    IpInfo getLocationInfo(HttpServletRequest request);
}
