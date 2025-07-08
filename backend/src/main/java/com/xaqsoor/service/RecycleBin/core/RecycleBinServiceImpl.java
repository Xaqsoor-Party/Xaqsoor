package com.xaqsoor.service.RecycleBin.core;

import com.xaqsoor.dto.response.RecycleItemsResponse;
import com.xaqsoor.service.RecycleBin.handler.AnnouncementRecycleService;
import com.xaqsoor.service.RecycleBin.handler.RecyclableEntityService;
import com.xaqsoor.service.RecycleBin.handler.UserRecycleService;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class RecycleBinServiceImpl implements RecycleBinService {

    private final Map<String, RecyclableEntityService> handlers;

    public RecycleBinServiceImpl(
            UserRecycleService userService,
            AnnouncementRecycleService announcementService
    ) {
        handlers = Map.of(
                "user", userService,
                "announcement", announcementService
        );
    }

    @Override
    public RecycleItemsResponse getDeletedItems(String entityType,int page, int size) {
        return handlers.get(entityType.toLowerCase()).getDeletedItems(page, size);
    }

    @Override
    public void restoreItem(String entityType, Long id) {
        handlers.get(entityType.toLowerCase()).restore(id);
    }

    @Override
    public void permanentlyDeleteItem(String entityType, Long id) {
        handlers.get(entityType.toLowerCase()).permanentlyDelete(id);
    }
}
