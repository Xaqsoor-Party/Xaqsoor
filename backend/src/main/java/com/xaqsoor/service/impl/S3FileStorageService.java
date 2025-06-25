package com.xaqsoor.service.impl;

import com.xaqsoor.service.FileStorageService;
import com.xaqsoor.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class S3FileStorageService implements FileStorageService {
    private final S3Service s3Service;

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        return s3Service.uploadFile(file, "public", folder);
    }
    @Override
    public void deleteFile(String filePath) {
        s3Service.deleteFile(filePath);
    }

    @Override
    public String getFileUrl(String filePath) {
        return s3Service.constructFileUrl(filePath);
    }
}
