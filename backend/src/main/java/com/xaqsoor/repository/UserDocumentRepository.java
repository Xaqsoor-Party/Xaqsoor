package com.xaqsoor.repository;

import com.xaqsoor.entity.UserDocument;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDocumentRepository extends CrudRepository<UserDocument, Long> {
}
