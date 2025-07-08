package com.xaqsoor.repository;

import com.xaqsoor.entity.Announcement;
import com.xaqsoor.enumeration.AnnouncementStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    Optional<Announcement> findByIdAndIsDeletedFalse(Long id);

    @Query("""
                SELECT a FROM Announcement a
                WHERE 
                    a.isDeleted = false
                    AND (:status IS NULL OR a.status = :status)
                    AND (
                        LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) 
                        OR LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    )
                ORDER BY a.announcementDate DESC
            """)
    Page<Announcement> searchAnnouncements(@Param("keyword") String keyword,
                                           @Param("status") AnnouncementStatus status,
                                           Pageable pageable);

    Page<Announcement> findAllByIsDeletedTrue(Pageable pageable);
    Optional<Announcement> findByIdAndIsDeletedTrue(Long id);
    boolean existsByIdAndIsDeletedTrue(Long id);
}
