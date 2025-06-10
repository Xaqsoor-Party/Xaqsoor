package com.xaqsoor.event;

import com.xaqsoor.entity.User;
import com.xaqsoor.enumeration.EventType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class UserEvent {
    private User user;
    private EventType eventType;
    private Map<?, ?> data;
}