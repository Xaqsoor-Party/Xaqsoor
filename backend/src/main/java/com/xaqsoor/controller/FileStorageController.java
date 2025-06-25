package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.service.FileStorageService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileStorageController {
    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<Response> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("folder") String folder,
            HttpServletRequest request) {

        String uploadedFileKey = fileStorageService.uploadFile(file, folder);
        String fileUrl = fileStorageService.getFileUrl(uploadedFileKey);
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Map.of(
                                "key", uploadedFileKey,
                                "url", fileUrl
                        ),
                        "File uploaded successfully",
                        HttpStatus.OK
                )
        );
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Response> deleteFile(
            @RequestParam("fileKey") String fileKey,
            HttpServletRequest request) {

        fileStorageService.deleteFile(fileKey);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        null,
                        "File deleted successfully",
                        HttpStatus.OK
                )
        );
    }
}
