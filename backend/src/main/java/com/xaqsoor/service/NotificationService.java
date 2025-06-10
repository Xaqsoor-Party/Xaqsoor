package com.xaqsoor.service;

import com.xaqsoor.util.IpInfo;

public interface NotificationService {
    void sendAccountCreationEmail(String name, String to, String tempPassword);
    void sendPasswordResetLink(String name, String to, String token);
    void sendLoginNotificationEmail(String to, IpInfo ipAddress, String deviceInfo);
}
