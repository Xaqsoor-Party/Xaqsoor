package com.xaqsoor.service;

import org.springframework.web.multipart.MultipartFile;

public interface ProfileImageService {

    String uploadProfileImage(String userId, MultipartFile profileImage);

    void deleteProfileImage(String userId);
}