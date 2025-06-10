package com.xaqsoor.repository;

import com.xaqsoor.entity.RefreshToken;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken,Long> {
    Optional<RefreshToken> findByToken(String refreshToken);

    @Query("SELECT r FROM RefreshToken r WHERE r.user.id = :userId AND r.revoked = false AND r.expiryDate > :now")
    List<RefreshToken> findActiveTokensByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);


    @Modifying
    @Transactional
    @Query("UPDATE RefreshToken r SET r.revoked = true " +
            "WHERE r.user.id = :userId " +
            "AND r.token <> :excludedToken " +
            "AND r.revoked = false " +
            "AND r.expiryDate > :now")
    int revokeAllOtherTokens(
            @Param("userId") Long userId,
            @Param("excludedToken") String excludedToken,
            @Param("now") LocalDateTime now);

}
