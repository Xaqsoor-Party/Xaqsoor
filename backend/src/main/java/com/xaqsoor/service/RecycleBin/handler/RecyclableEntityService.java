package com.xaqsoor.service.RecycleBin.handler;

import com.xaqsoor.dto.response.RecycleItemsResponse;

public interface RecyclableEntityService {
        RecycleItemsResponse getDeletedItems(int page, int size);
        void restore(Long id);
        void permanentlyDelete(Long id);
}
