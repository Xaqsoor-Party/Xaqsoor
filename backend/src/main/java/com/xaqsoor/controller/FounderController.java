package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.dto.request.FounderRequestDto;
import com.xaqsoor.service.FounderService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

}
