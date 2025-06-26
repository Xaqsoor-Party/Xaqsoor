package com.xaqsoor.mapper;

import com.xaqsoor.dto.UserDocumentDto;
import com.xaqsoor.entity.UserDocument;
import com.xaqsoor.service.S3Service;
import com.xaqsoor.util.UserUtil;


public class UserDocumentMapper {
    public static UserDocumentDto toDto(UserDocument entity, S3Service s3Service) {
        String fileUrl = UserUtil.resolveProfileImageUrl(entity.getFileStorageKey(), s3Service);
        return new UserDocumentDto(
                entity.getId(),
                entity.getDocumentType().name(),
                fileUrl,
                entity.isVerified(),
                entity.getRejectionReason(),
                entity.getCountry(),
                entity.getDocumentNumber(),
                UserUtil.formatDate(entity.getIssuedAt()),
                UserUtil.formatDate(entity.getExpiresAt())
        );
    }
}
