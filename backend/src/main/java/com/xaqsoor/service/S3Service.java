package com.xaqsoor.service;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {
    String uploadFile(MultipartFile file, String userId, String folderName);
    void deleteFile(String imageKey);
    String constructFileUrl(String imageKey);
}
