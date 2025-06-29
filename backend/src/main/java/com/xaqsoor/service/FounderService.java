package com.xaqsoor.service;

import com.xaqsoor.dto.request.FounderRequestDto;
import com.xaqsoor.dto.response.UserCardListDto;

public interface FounderService {
    void submitFounderProfile(FounderRequestDto request);
    UserCardListDto getAllFounders(String searchTerm,String genderFilter,String statusFilter,String orderBy,int pageNumber, int pageSize);
}
