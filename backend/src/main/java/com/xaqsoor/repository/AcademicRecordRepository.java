package com.xaqsoor.repository;

import com.xaqsoor.entity.AcademicRecord;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicRecordRepository extends CrudRepository<AcademicRecord, Long> {
    List<AcademicRecord> findByUserIdOrderByStartDateDesc(Long userId);
}
