package com.xaqsoor.event.listener;

import com.xaqsoor.event.UserEvent;
import com.xaqsoor.service.NotificationService;
import com.xaqsoor.util.IpInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventListener {
    private final NotificationService notificationService;

    @EventListener
    public void onUserEvent(UserEvent event) {
        if (event == null || event.getUser() == null) {
            log.warn("Received null or invalid user event. Skipping processing.");
            return;
        }

        switch (event.getEventType()) {
            case REGISTRATION:
                String tempPassword = event.getData() != null ? (String) event.getData().get("tempPassword") : null;

                if (tempPassword == null) {
                    log.warn("Registration event missing for user: {}", event.getUser().getEmail());
                    return;
                }
                notificationService.sendAccountCreationEmail(
                        event.getUser().getFirstName() + " " + event.getUser().getMiddleName() + " " + event.getUser().getLastName(),
                        event.getUser().getEmail(),
                        tempPassword
                );
                break;
            case RESET_PASSWORD:
                String key = event.getData() != null ? (String) event.getData().get("key") : null;
                if (key == null) {
                    log.warn("Reset password event missing reset key for user: {}", event.getUser().getEmail());
                    return;
                }
                notificationService.sendPasswordResetLink(
                        event.getUser().getFirstName() + " " + event.getUser().getMiddleName() + " " + event.getUser().getLastName(),
                        event.getUser().getEmail(),
                        key
                );
                break;
            case LOGIN:
                IpInfo ipAddress = (IpInfo) (event.getData() != null ? event.getData().get("ipAddress") : null);
                String deviceInfo = (String) (event.getData() != null ? event.getData().get("deviceInfo") : null);
                if (ipAddress == null || deviceInfo == null) {
                    log.warn("Login event missing IP address or device info for user: {}", event.getUser().getEmail());
                    return;
                }

                notificationService.sendLoginNotificationEmail(
                        event.getUser().getEmail(),
                        ipAddress,
                        deviceInfo
                );
                break;
            default:
                log.warn("Unhandled event type: {}", event.getEventType());
        }
    }
}