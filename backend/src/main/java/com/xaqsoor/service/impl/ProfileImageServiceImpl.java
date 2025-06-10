package com.xaqsoor.service.impl;

import com.xaqsoor.entity.User;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.service.ProfileImageService;
import com.xaqsoor.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class ProfileImageServiceImpl implements ProfileImageService {
    private final S3Service s3Service;
    private final UserRepository userRepository;
    @Override
    public String uploadProfileImage(String userId, MultipartFile profileImage) {
        User user = userRepository.findByUserIdIgnoreCase(userId)
                .orElseThrow(() -> new ApiException("User not found"));
        if (user.getProfileImageKey() != null && !user.getProfileImageKey().isEmpty()) {
            s3Service.deleteFile(user.getProfileImageKey());
        }
        String key = s3Service.uploadFile(profileImage, userId,"profileImages");
        user.setProfileImageKey(key);
        userRepository.save(user);

        return s3Service.constructFileUrl(key);
    }

    @Override
    public void deleteProfileImage(String userId) {
        User user = userRepository.findByUserIdIgnoreCase(userId)
                .orElseThrow(() -> new ApiException("User not found"));
        s3Service.deleteFile(user.getProfileImageKey());
        user.setProfileImageKey("");
        userRepository.save(user);
    }
}
