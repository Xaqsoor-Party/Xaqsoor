package com.xaqsoor.dto.response;

import java.util.List;

public record RecycleItemsResponse(
        int totalItems,
        int pageNumber,
        int pageSize,
        String entityType,
        List<?> items
) {
}