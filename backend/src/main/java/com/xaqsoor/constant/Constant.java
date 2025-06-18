package com.xaqsoor.constant;

import java.time.ZoneId;

public class Constant {
    public static final ZoneId APP_ZONE = ZoneId.of("Europe/Istanbul");
    public static final String ROLE_PREFIX = "ROLE_";
    public static final String AUTHORITY_DELIMITER = ",";

    // Core Authorities
    private static final String CREATE_MEMBER = "create_member";
    private static final String DELETE_MEMBER = "delete_member";
    private static final String UPDATE_MEMBER = "update_member";
    private static final String VIEW_MEMBER = "view_member";  // Common authority
    private static final String MANAGE_ROLES = "manage_roles";
    private static final String MANAGE_SETTINGS = "manage_settings";

    // Operational Authorities
    private static final String REVIEW_FORMS = "review_forms";
    private static final String SEND_FOLLOWUP = "send_followup";
    private static final String VIEW_LOGS = "view_logs";
    private static final String IMPORT_MEMBERS = "import_members";
    private static final String VIEW_MEMBERS = "view_members";
    private static final String EXPORT_MEMBERS = "export_members";
    private static final String MANAGE_CONSTITUENCIES = "manage_constituencies";  // Common authority
    private static final String VIEW_CONSTITUENCIES = "view_constituencies";  // Common authority
    private static final String MANAGE_CANDIDATES = "manage_candidates";  // Common authority
    private static final String VIEW_CANDIDATES = "view_candidates";  // Common authority
    private static final String MANAGE_CAMPAIGN_EVENTS = "manage_campaign_events";
    private static final String MANAGE_ANNOUNCEMENTS = "manage_announcements";
    private static final String MANAGE_MEDIA = "manage_media";
    private static final String VIEW_REPORTS = "view_reports";
    private static final String VIEW_RESULTS = "view_results";  // Common authority
    private static final String VIEW_DASHBOARD = "view_dashboard";  // Common authority

    // Common Authorities for All Roles
    private static final String[] COMMON_AUTHORITIES = {
            VIEW_MEMBER, VIEW_CONSTITUENCIES, VIEW_CANDIDATES, VIEW_DASHBOARD, VIEW_RESULTS
    };

    // Role-based authority definitions
    public static final String SUPER_ADMIN_AUTHORITIES = String.join(AUTHORITY_DELIMITER,
            String.join(AUTHORITY_DELIMITER, COMMON_AUTHORITIES),
            CREATE_MEMBER, DELETE_MEMBER, UPDATE_MEMBER, MANAGE_ROLES, MANAGE_SETTINGS,
            REVIEW_FORMS, SEND_FOLLOWUP, VIEW_LOGS,
            IMPORT_MEMBERS, VIEW_MEMBERS, EXPORT_MEMBERS, MANAGE_CONSTITUENCIES,
            MANAGE_CANDIDATES, MANAGE_CAMPAIGN_EVENTS,
            MANAGE_ANNOUNCEMENTS, MANAGE_MEDIA, VIEW_REPORTS
    );

    public static final String ADMIN_AUTHORITIES = String.join(AUTHORITY_DELIMITER,
            String.join(AUTHORITY_DELIMITER, COMMON_AUTHORITIES),
            CREATE_MEMBER, UPDATE_MEMBER, VIEW_MEMBER, MANAGE_ROLES,
            REVIEW_FORMS, SEND_FOLLOWUP,
            IMPORT_MEMBERS, VIEW_MEMBERS, MANAGE_CONSTITUENCIES,
            MANAGE_CANDIDATES, VIEW_CANDIDATES,
            VIEW_DASHBOARD, VIEW_REPORTS
    );

    public static final String COORDINATOR_AUTHORITIES = String.join(AUTHORITY_DELIMITER,
            String.join(AUTHORITY_DELIMITER, COMMON_AUTHORITIES),
            VIEW_MEMBER, REVIEW_FORMS,
            IMPORT_MEMBERS, VIEW_MEMBERS, MANAGE_CONSTITUENCIES,
            MANAGE_CANDIDATES, VIEW_CANDIDATES,
            MANAGE_CAMPAIGN_EVENTS, VIEW_DASHBOARD, VIEW_REPORTS
    );

    public static final String MEDIA_MANAGER_AUTHORITIES = String.join(AUTHORITY_DELIMITER,
            String.join(AUTHORITY_DELIMITER, COMMON_AUTHORITIES),
            MANAGE_ANNOUNCEMENTS, MANAGE_MEDIA, VIEW_MEMBER
    );

    public static final String CANDIDATE_AUTHORITIES = String.join(AUTHORITY_DELIMITER,
            String.join(AUTHORITY_DELIMITER, COMMON_AUTHORITIES),
            VIEW_CONSTITUENCIES, VIEW_MEMBERS,
            VIEW_REPORTS, VIEW_DASHBOARD
    );

    public static final String REVIEWER_AUTHORITIES = String.join(AUTHORITY_DELIMITER,
            String.join(AUTHORITY_DELIMITER, COMMON_AUTHORITIES),
            REVIEW_FORMS, VIEW_MEMBER
    );

    public static final String COMMUNICATOR_AUTHORITIES = String.join(AUTHORITY_DELIMITER,
            String.join(AUTHORITY_DELIMITER, COMMON_AUTHORITIES),
            SEND_FOLLOWUP, VIEW_MEMBER
    );

    public static final String AUDITOR_AUTHORITIES = String.join(AUTHORITY_DELIMITER,
            String.join(AUTHORITY_DELIMITER, COMMON_AUTHORITIES),
            VIEW_LOGS, VIEW_MEMBER, VIEW_REPORTS
    );

    public static final String VIEWER_AUTHORITIES = String.join(AUTHORITY_DELIMITER,
            String.join(AUTHORITY_DELIMITER, COMMON_AUTHORITIES),
            VIEW_REPORTS, VIEW_CANDIDATES, VIEW_CONSTITUENCIES
    );

    public static final String MEMBER_AUTHORITIES = String.join(AUTHORITY_DELIMITER,
            String.join(AUTHORITY_DELIMITER, COMMON_AUTHORITIES),
            VIEW_CANDIDATES, VIEW_RESULTS
    );

    private Constant() {
    }
}
