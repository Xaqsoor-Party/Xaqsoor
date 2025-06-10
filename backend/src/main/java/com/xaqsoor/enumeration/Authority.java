package com.xaqsoor.enumeration;

import lombok.Getter;

import static com.xaqsoor.constant.Constant.*;

@Getter
public enum Authority {
    SUPER_ADMIN(SUPER_ADMIN_AUTHORITIES),
    ADMIN(ADMIN_AUTHORITIES),
    COORDINATOR(COORDINATOR_AUTHORITIES),
    MEDIA_MANAGER(MEDIA_MANAGER_AUTHORITIES),
    CANDIDATE(CANDIDATE_AUTHORITIES),
    REVIEWER(REVIEWER_AUTHORITIES),
    COMMUNICATOR(COMMUNICATOR_AUTHORITIES),
    AUDITOR(AUDITOR_AUTHORITIES),
    VIEWER(VIEWER_AUTHORITIES),
    MEMBER(MEMBER_AUTHORITIES);

    private final String value;

    Authority(final String value) {
        this.value = value;
    }
}