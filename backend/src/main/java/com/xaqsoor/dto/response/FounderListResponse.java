package com.xaqsoor.dto.response;

import java.util.List;

public record FounderListResponse(
        int totalItems,
        int pageNumber,
        int pageSize,
        List<FounderResponseDto> founders
)  {
}
