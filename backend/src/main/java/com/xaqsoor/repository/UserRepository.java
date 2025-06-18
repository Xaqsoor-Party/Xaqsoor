package com.xaqsoor.repository;

import com.xaqsoor.entity.User;
import com.xaqsoor.enumeration.MembershipLevel;
import com.xaqsoor.enumeration.Status;
import com.xaqsoor.projections.RecentActivityProjection;
import com.xaqsoor.repository.sql.SqlQueries;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    Optional<User> findByUserIdIgnoreCase(String userId);

    boolean existsByPhoneIgnoreCase(String phone);

    @Query(value = SqlQueries.SEARCH_USER_CARDS_QUERY,
            countQuery = SqlQueries.SEARCH_USER_CARDS_COUNT_QUERY,
            nativeQuery = true)
    Page<User> searchUserCardsNative(
            @Param("searchTerm") String searchTerm,
            @Param("status") String status,
            @Param("role") String role,
            @Param("gender") String gender,
            @Param("membershipLevel") String membershipLevel,
            Pageable pageable
    );

    @Query(value = SqlQueries.SEARCH_USER_CARDS_QUERY, nativeQuery = true)
    List<User> searchUserCardsNativeNoPage(
            @Param("searchTerm") String searchTerm,
            @Param("status") String status,
            @Param("role") String role,
            @Param("gender") String gender,
            @Param("membershipLevel") String membershipLevel
    );

    @Query(value = SqlQueries.SEARCH_USER_CARDS_COUNT_QUERY, nativeQuery = true)
    long countUserCardsByFilters(
            @Param("searchTerm") String searchTerm,
            @Param("status") String status,
            @Param("role") String role,
            @Param("gender") String gender,
            @Param("membershipLevel") String membershipLevel
    );

    Optional<User> findByIdAndIsDeletedFalse(Long id);

    long countByCreatedDateAfter(LocalDateTime startOfMonth);

    long countByAccountNonLockedFalse();

    long countByMfaEnabledTrue();

    long countByEmailVerifiedFalse();

    long countByIsLoginRestrictedTrue();

    long countByMembershipLevel(MembershipLevel level);

    long countByStatus(Status status);

    long countByRole_Id(Long roleId);

    long countByProfileImageKeyIsNotNullAndProfileImageKeyNot(String empty);

    long countByDateOfBirthIsNotNull();

    long countByCreatedDateBetween(LocalDateTime startOfMonth, LocalDateTime endOfMonth);

    long countByBioIsNotNullAndBioNot(String empty);

    long countByPhoneIsNotNullAndPhoneNot(String empty);

    long countByCityIsNotNullAndCityNot(String empty);

    @Query(value = """
    SELECT CAST(created_date AS date) as signup_date, 
           COUNT(id) as user_count
    FROM users
    WHERE created_date BETWEEN :start AND :end
    GROUP BY CAST(created_date AS date)
    ORDER BY signup_date
    """, nativeQuery = true)
    List<Object[]> getDailySignupsBetweenDates(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query(value = """
        (SELECT
            u.id as userId,
            u.first_name as firstName,
            u.profile_image_key as profileImageKey,
            'Updated profile' as description,
            u.modified_date as timestamp
        FROM users u
        WHERE u.modified_date IS NOT NULL
        ORDER BY u.modified_date DESC
        LIMIT :limit)

        UNION ALL

        (SELECT
            u.id as userId,
            u.first_name as firstName,
            u.profile_image_key as profileImageKey,
            'Logged in' as description,
            u.last_login as timestamp
        FROM users u
        WHERE u.last_login IS NOT NULL
        ORDER BY u.last_login DESC
        LIMIT :limit)

        UNION ALL

        (SELECT
            we.user_id as userId,
            u.first_name as firstName,
            u.profile_image_key as profileImageKey,
            'Added work experience at ' || we.company_name as description,
            we.created_date as timestamp
        FROM work_experience we
        JOIN users u ON we.user_id = u.id
        ORDER BY we.created_date DESC
        LIMIT :limit)

        UNION ALL

        (SELECT
            ar.user_id as userId,
            u.first_name as firstName,
            u.profile_image_key as profileImageKey,
            'Added education at ' || ar.institution_name as description,
            ar.created_date as timestamp
        FROM academic_record ar
        JOIN users u ON ar.user_id = u.id
        ORDER BY ar.created_date DESC
        LIMIT :limit)

        ORDER BY timestamp DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<RecentActivityProjection> findRecentActivities(@Param("limit") int limit);

    @Query(value = SqlQueries.RECENT_ACTIVITIES_QUERY,
            countQuery = SqlQueries.RECENT_ACTIVITIES_COUNT_QUERY,
            nativeQuery = true)
    Page<RecentActivityProjection> findRecentActivities(Pageable pageable);



    long countByGender(String gender);
}
