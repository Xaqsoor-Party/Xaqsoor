package com.xaqsoor.repository;

import com.xaqsoor.entity.User;
import com.xaqsoor.entity.UserCredential;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCredentialRepository extends CrudRepository<UserCredential, Long> {
    Optional<UserCredential> getCredentialByUserId(Long userId);
    Optional<UserCredential> findByUser(User user);
}
