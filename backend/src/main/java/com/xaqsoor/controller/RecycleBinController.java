package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.dto.response.RecycleItemsResponse;
import com.xaqsoor.service.RecycleBin.core.RecycleBinService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/recycle-bin")
public class RecycleBinController {

    private final RecycleBinService recycleBinService;

    public RecycleBinController(RecycleBinService recycleBinService) {
        this.recycleBinService = recycleBinService;
    }

    @GetMapping("/{entityType}")
    public ResponseEntity<Response> getDeletedItems(
            @PathVariable String entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request
    ) {
        RecycleItemsResponse deletedItems = recycleBinService.getDeletedItems(entityType, page, size);
        String key = entityType.toLowerCase() + "s";
        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Map.of(key, deletedItems),
                        "Deleted " + entityType + " items fetched successfully.",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/{entityType}/{id}/restore")
    public ResponseEntity<Response> restore(
            @PathVariable String entityType,
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        recycleBinService.restoreItem(entityType, id);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        null,
                        "Successfully restored " + entityType + " with ID " + id,
                        HttpStatus.OK
                )
        );
    }

    @DeleteMapping("/{entityType}/{id}")
    public ResponseEntity<Response> permanentlyDelete(
            @PathVariable String entityType,
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        recycleBinService.permanentlyDeleteItem(entityType, id);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        null,
                        "Permanently deleted " + entityType + " with ID " + id,
                        HttpStatus.OK
                )
        );
    }
}

