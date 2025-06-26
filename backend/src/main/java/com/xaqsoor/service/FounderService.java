package com.xaqsoor.service;

import com.xaqsoor.dto.request.FounderRequestDto;
import com.xaqsoor.dto.response.FounderListResponse;

public interface FounderService {
    void submitFounderProfile(FounderRequestDto request);
    FounderListResponse getAllFounders();
}
