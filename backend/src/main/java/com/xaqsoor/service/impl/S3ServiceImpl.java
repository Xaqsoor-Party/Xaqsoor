package com.xaqsoor.service.impl;

import com.xaqsoor.exception.ApiException;
import com.xaqsoor.service.S3Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

@Service
@Slf4j
public class S3ServiceImpl implements S3Service {
    @Value("${aws.s3.bucket}")
    private String bucketName;

    private final S3Client s3Client;

    public S3ServiceImpl(
            @Value("${aws.region}") String region,
            @Value("${aws.accessKeyId}") String accessKey,
            @Value("${aws.secretKey}") String secretKey
    ) {
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)
                ))
                .build();
    }

    @Override
    public String uploadFile(MultipartFile file, String userId, String folderName) {
        if (file == null || file.isEmpty()) {
            log.warn("Upload failed: file is null or empty");
            throw new ApiException("Something went wrong while uploading the file. Please try again.");
        }

        if (userId == null || userId.isBlank()) {
            log.warn("Upload failed: userId is null or blank");
            throw new ApiException("Something went wrong while uploading the file. Please try again.");
        }

        if (folderName == null || folderName.isBlank()) {
            log.warn("Upload failed: folderName is null or blank");
            throw new ApiException("Something went wrong while uploading the file. Please try again.");
        }
        try {
            String fileExtension = getFileExtension(Objects.requireNonNull(file.getOriginalFilename()));
            String fileName = folderName + "/" + userId + "/" + generateUniqueFileName(fileExtension);

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(request,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            return fileName;
        } catch (IOException e) {
            log.error("S3 upload failed for userId={}, folderName={}, reason={}", userId, folderName, e.getMessage());
            throw new ApiException("Unable to upload the file at the moment. Please try again later.");
        }
    }

    @Override
    public void deleteFile(String imageKey) {
        if (imageKey == null || imageKey.isBlank()) {
            log.warn("Delete failed: imageKey is null or blank");
            throw new ApiException("Something went wrong while deleting the file. Please try again.");
        }
        try {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(imageKey)
                    .build();
            s3Client.deleteObject(request);
        } catch (S3Exception e) {
            log.error("Failed to delete file from S3: key={}, reason={}", imageKey, e.awsErrorDetails().errorMessage(), e);
            throw new ApiException("Unable to delete the file at the moment. Please try again later.");
        } catch (Exception e) {
            log.error("Unexpected error during file deletion: key={}, error={}", imageKey, e.getMessage(), e);
            throw new ApiException("Unable to delete the file at the moment. Please try again later.");
        }
    }

    @Override
    public String constructFileUrl(String imageKey) {
        if (imageKey == null || imageKey.isBlank()) {
            log.warn("URL construction failed: imageKey is null or blank");
            throw new ApiException("Unable to retrieve the file URL. Please try again.");
        }
        try {
            return s3Client.utilities()
                    .getUrl(builder -> builder.bucket(bucketName).key(imageKey))
                    .toExternalForm();
        } catch (S3Exception e) {
            log.error("Failed to construct S3 file URL: key={}, reason={}", imageKey, e.awsErrorDetails().errorMessage(), e);
            throw new ApiException("Unable to retrieve the file URL at the moment. Please try again later.");
        } catch (Exception e) {
            log.error("Unexpected error constructing file URL: key={}, error={}", imageKey, e.getMessage(), e);
            throw new ApiException("Unable to retrieve the file URL at the moment. Please try again later.");
        }
    }

    private String getFileExtension(String fileName) {
        String extension = "";
        int dotIndex = fileName.lastIndexOf(".");
        if (dotIndex > 0) {
            extension = fileName.substring(dotIndex);
        }
        return extension.toLowerCase();
    }

    private String generateUniqueFileName(String fileExtension) {
        String uniqueId = UUID.randomUUID().toString().substring(0, 8);
        long timestamp = System.currentTimeMillis();

        return timestamp + "_" + uniqueId + fileExtension;
    }

}
