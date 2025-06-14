package com.xaqsoor.repository;

import com.xaqsoor.entity.User;
import com.xaqsoor.repository.sql.SqlQueries;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}
