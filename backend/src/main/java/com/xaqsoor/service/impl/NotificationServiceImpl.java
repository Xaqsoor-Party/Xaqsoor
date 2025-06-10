package com.xaqsoor.service.impl;

import com.xaqsoor.service.NotificationService;
import com.xaqsoor.util.IpInfo;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class NotificationServiceImpl implements NotificationService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${mail.verify.url}")
    private String verificationUrl;

    @Override
    @Async
    public void sendAccountCreationEmail(String name, String to, String tempPassword) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("username", to);
            context.setVariable("tempPassword", tempPassword);
            context.setVariable("url", verificationUrl + "login");

            MimeMessage mailMessage = getMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mailMessage, true, "UTF-8");
            helper.setPriority(1);
            helper.setSubject("Activate Your Xaqsoor Account Today");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            String text = templateEngine.process("registration-email", context);
            helper.setText(text, true);
            mailSender.send(mailMessage);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Async
    public void sendPasswordResetLink(String name, String to, String token) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("url", verificationUrl + "reset-password/" + token);

            MimeMessage mailMessage = getMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mailMessage, true, "UTF-8");
            helper.setPriority(1);
            helper.setSubject("Xaqsoor – Password Reset Request");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            String text = templateEngine.process("reset-password-email", context);
            helper.setText(text, true);
            mailSender.send(mailMessage);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @Override
    @Async
    public void sendLoginNotificationEmail(String to, IpInfo ipInfo, String deviceInfo) {
        try {
            Context context = new Context();
            context.setVariable("deviceInfo", deviceInfo);
            context.setVariable("ipInfo", ipInfo.toString());

            MimeMessage mailMessage = getMimeMessage();
            mailMessage.setHeader("X-Category", "Updates");
            MimeMessageHelper helper = new MimeMessageHelper(mailMessage, true, "UTF-8");
            helper.setPriority(1);
            helper.setSubject("Xaqsoor – New Login Detected on Your Account");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            String text = templateEngine.process("login-notification-email", context);
            helper.setText(text, true);
            mailSender.send(mailMessage);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private MimeMessage getMimeMessage() {
        return mailSender.createMimeMessage();
    }
}
