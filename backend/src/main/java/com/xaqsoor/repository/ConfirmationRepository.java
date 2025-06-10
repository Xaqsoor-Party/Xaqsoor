package com.xaqsoor.repository;

import com.xaqsoor.entity.Confirmation;
import com.xaqsoor.enumeration.ConfirmationType;
import com.xaqsoor.projections.ConfirmationProjection;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfirmationRepository extends CrudRepository<Confirmation, Long> {
    @Query("SELECT c.key AS key, c.user.email AS email, c.user.firstName AS firstName, c.user.middleName AS middleName, c.user.lastName AS lastName, c.type AS type, c.expiryDate AS expiryDate FROM Confirmation c WHERE c.key = :key")
    Optional<ConfirmationProjection> findProjectionByKey(@Param("key") String key);

    @Query("SELECT COUNT(c) FROM Confirmation c WHERE c.user.id = :userId AND c.type = :type")
    long countByUserIdAndType(@Param("userId") Long userId, @Param("type") ConfirmationType type);

    @Query("SELECT c.key FROM Confirmation c WHERE c.user.id = :userId AND c.type = :type AND c.expiryDate > CURRENT_TIMESTAMP")
    Optional<String> findValidKeyByUserIdAndType(@Param("userId") Long userId, @Param("type") ConfirmationType type);

    @Modifying
    @Query("DELETE FROM Confirmation c WHERE c.user.id = :userId AND c.type = :type")
    void deleteByUserIdAndType(@Param("userId") Long userId, @Param("type") ConfirmationType type);

    void deleteByKey(String key);
}
