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

    @Query(value = SqlQueries.DAILY_SIGNUPS_QUERY, nativeQuery = true)
    List<Object[]> getDailySignupsBetweenDates(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query(value = SqlQueries.RECENT_ACTIVITIES_QUERY,
            countQuery = SqlQueries.RECENT_ACTIVITIES_COUNT_QUERY,
            nativeQuery = true)
    Page<RecentActivityProjection> findRecentActivities(Pageable pageable);



    long countByGender(String gender);
}
