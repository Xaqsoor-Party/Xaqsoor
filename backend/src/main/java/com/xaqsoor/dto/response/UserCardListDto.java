package com.xaqsoor.dto.response;

import java.util.List;

public record UserCardListDto(
        int totalItems,
        int pageNumber,
        int pageSize,
        List<UserCardDTO> users
) {}