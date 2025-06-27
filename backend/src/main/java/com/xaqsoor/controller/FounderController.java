package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.dto.request.FounderRequestDto;
import com.xaqsoor.dto.response.UserCardListDto;
import com.xaqsoor.service.FounderService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/v1/founders")
@RequiredArgsConstructor
public class FounderController {

    private final FounderService founderService;

    @PostMapping("/submit")
    public ResponseEntity<Response> submitFounderProfile(
            @RequestBody FounderRequestDto request,
            HttpServletRequest httpServletRequest) {

        founderService.submitFounderProfile(request);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        httpServletRequest,
                        null,
                        "Founder profile submitted successfully",
                        HttpStatus.OK
                )
        );
    }

    @GetMapping("/all")
    public ResponseEntity<Response> getAllFounders(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String genderFilter,
            @RequestParam(required = false) String statusFilter,
            @RequestParam(required = false, defaultValue = "createdDateAsc") String orderBy,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "20") int pageSize,
            HttpServletRequest httpServletRequest) {

        UserCardListDto result = founderService.getAllFounders(searchTerm, genderFilter, statusFilter, orderBy, pageNumber, pageSize);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        httpServletRequest,
                        Collections.singletonMap("founders", result),
                        "Founders fetched successfully",
                        HttpStatus.OK
                )
        );
    }
}
