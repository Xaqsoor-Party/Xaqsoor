package com.xaqsoor.repository;

import com.xaqsoor.entity.WorkExperience;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkExperienceRepository extends CrudRepository<WorkExperience, Long> {
    List<WorkExperience> findByUserIdOrderByStartDateDesc(Long userId);
}
