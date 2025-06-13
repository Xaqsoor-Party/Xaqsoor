package com.xaqsoor.repository.sql;

public class SqlQueries {

    public static final String SEARCH_USER_CARDS_QUERY = """
        SELECT
            u.id,
            u.user_id,
            u.first_name,
            u.middle_name,
            u.last_name,
            u.gender,
            u.place_of_birth,
            u.date_of_birth,
            u.status,
            u.membership_level,
            u.role_id,
            r.name AS role_name,
            u.email,
            u.phone,
            u.bio,
            u.failed_login_attempts,
            u.last_login,
            u.profile_image_key,
            u.account_non_expired,
            u.account_non_locked,
            u.is_login_restricted,
            u.email_verified,
            u.enabled,
            u.mfa_enabled,
            u.mfa_secret,
            u.mfa_qr_code_image_uri,
            u.street,
            u.city,
            u.state,
            u.country,
            u.created_by,
            u.modified_by,
            u.created_date,
            u.modified_date,
            u.is_deleted,
            u.reference_id
        FROM
            users u
        JOIN
            roles r ON u.role_id = r.id
        WHERE
            (
                :searchTerm IS NULL OR :searchTerm = '' OR
                LOWER(u.first_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
                LOWER(u.middle_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
                LOWER(u.last_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
                LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
                LOWER(u.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%'))
            )
        AND
            (
                :status IS NULL OR u.status = CAST(:status AS TEXT)
            )
        AND
            (
                :role IS NULL OR :role = '' OR r.name = :role
            )
        AND
            (
                :gender IS NULL OR :gender = '' OR u.gender = :gender
            )
        AND
            (
                :membershipLevel IS NULL OR :membershipLevel = '' OR u.membership_level = CAST(:membershipLevel AS TEXT)
            )
        AND u.is_deleted = false
        """;

    public static final String SEARCH_USER_CARDS_COUNT_QUERY = """
        SELECT count(u.id)
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE
            (:searchTerm IS NULL OR :searchTerm = '' OR
            LOWER(u.first_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            LOWER(u.middle_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            LOWER(u.last_name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
            LOWER(u.phone) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
        AND
            (:status IS NULL OR u.status = CAST(:status AS TEXT))
        AND
            (:role IS NULL OR :role = '' OR r.name = :role)
        AND
            (:gender IS NULL OR :gender = '' OR u.gender = :gender)
        AND
            (:membershipLevel IS NULL OR :membershipLevel = '' OR u.membership_level = CAST(:membershipLevel AS TEXT))
        AND u.is_deleted = false
        """;

}
