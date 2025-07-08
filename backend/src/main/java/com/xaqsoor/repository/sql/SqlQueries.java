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
                u.network_operator,
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
                u.district,
                u.created_by,
                u.modified_by,
                u.created_date,
                u.modified_date,
                u.is_deleted,
                u.reference_id,
                u.signature_image
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

    public static final String RECENT_ACTIVITIES_QUERY = """
                (SELECT
                    u.id AS userId,
                    u.first_name AS firstName,
                    u.profile_image_key AS profileImageKey,
                    CASE
                      WHEN u.modified_by IS NOT NULL AND u.modified_by != u.id AND u.modified_by != 0 THEN
                          CONCAT('Profile was updated by ', mu.first_name)
                      ELSE 'Updated their profile'
                     END AS description,
                    u.modified_date AS timestamp
                FROM users u
                LEFT JOIN users mu ON u.modified_by = mu.id
                WHERE u.modified_date IS NOT NULL AND (u.modified_by IS NULL OR u.modified_by != 0))
            
                UNION ALL
            
                (SELECT
                    u.id AS userId,
                    u.first_name AS firstName,
                    u.profile_image_key AS profileImageKey,
                    'Logged in' AS description,
                    u.last_login AS timestamp
                FROM users u
                WHERE u.last_login IS NOT NULL)
            
                UNION ALL
            
                (SELECT
                    we.user_id AS userId,
                    u.first_name AS firstName,
                    u.profile_image_key AS profileImageKey,
                    'Added work experience' AS description,
                    we.created_date AS timestamp
                FROM work_experience we
                JOIN users u ON we.user_id = u.id)
            
                UNION ALL
            
                (SELECT
                    ar.user_id AS userId,
                    u.first_name AS firstName,
                    u.profile_image_key AS profileImageKey,
                    'Added education' AS description,
                    ar.created_date AS timestamp
                FROM academic_record ar
                JOIN users u ON ar.user_id = u.id)
            
                UNION ALL
            
                (SELECT
                    u.id AS userId,
                    u.first_name AS firstName,
                    u.profile_image_key AS profileImageKey,
                    'Joined party' AS description,
                    u.created_date AS timestamp
                FROM users u)
            """;

    public static final String RECENT_ACTIVITIES_COUNT_QUERY = """
                SELECT count(*) FROM (
                    SELECT 1 FROM users u
                    WHERE u.modified_date IS NOT NULL AND (u.modified_by IS NULL OR u.modified_by != 0)
            
                    UNION ALL
            
                    SELECT 1 FROM users u
                    WHERE u.last_login IS NOT NULL
            
                    UNION ALL
            
                    SELECT 1 FROM work_experience we
                    JOIN users u ON we.user_id = u.id
            
                    UNION ALL
            
                    SELECT 1 FROM academic_record ar
                    JOIN users u ON ar.user_id = u.id
            
                    UNION ALL
            
                    SELECT 1 FROM users u
                ) AS count_table
            """;

    public static final String DAILY_SIGNUPS_QUERY = """
                SELECT CAST(created_date AS date) as signup_date,
                   COUNT(id) as user_count
                FROM users
                WHERE created_date BETWEEN :start AND :end
                GROUP BY CAST(created_date AS date)
                ORDER BY signup_date
            """;

    public static final String FILTERED_USERS_QUERY = """
                SELECT u.*
                FROM users u
                WHERE u.is_deleted = false
                  AND (:status IS NULL OR u.status = CAST(:status AS TEXT))
                  AND (:gender IS NULL OR u.gender = :gender)
                  AND (:operator IS NULL OR u.network_operator = :operator)
                  AND (:membershipLevel IS NULL OR u.membership_level = CAST(:membershipLevel AS TEXT))
            """;


    public static final String FILTERED_USERS_COUNT_QUERY = """
                SELECT COUNT(*)
                FROM users u
                WHERE u.is_deleted = false
                  AND (:status IS NULL OR u.status = CAST(:status AS TEXT))
                  AND (:gender IS NULL OR u.gender = :gender)
                  AND (:operator IS NULL OR u.network_operator = :operator)
                  AND (:membershipLevel IS NULL OR u.membership_level = CAST(:membershipLevel AS TEXT))
            """;

}
