package com.xaqsoor.service;

import com.xaqsoor.dto.response.MembershipCardDto;

import java.time.LocalDate;

public interface MembershipCardService {
    MembershipCardDto generateMembershipCard(Long userId, LocalDate validUntil);
}
