package com.xaqsoor.service.RecycleBin.core;

import com.xaqsoor.dto.response.RecycleItemsResponse;

public interface RecycleBinService {
    RecycleItemsResponse getDeletedItems(String entityType,int page, int size);
    void restoreItem(String entityType, Long id);
    void permanentlyDeleteItem(String entityType, Long id);
}
