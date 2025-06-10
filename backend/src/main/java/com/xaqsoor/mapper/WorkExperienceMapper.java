package com.xaqsoor.mapper;

import com.xaqsoor.dto.WorkExperienceDto;
import com.xaqsoor.entity.WorkExperience;

import java.time.format.DateTimeFormatter;

public class WorkExperienceMapper {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy");

    public static WorkExperienceDto toDto(WorkExperience experience) {
        if (experience == null) {
            return null;
        }

        String startDateFormatted = experience.getStartDate() != null
                ? experience.getStartDate().format(FORMATTER)
                : null;

        String endDateFormatted = experience.getEndDate() != null
                ? experience.getEndDate().format(FORMATTER)
                : null;

        return new WorkExperienceDto(
                experience.getId(),
                experience.getJobTitle(),
                experience.getCompanyName(),
                experience.getLocation(),
                startDateFormatted,
                endDateFormatted,
                experience.getCurrentlyWorking(),
                experience.getDescription()
        );
    }
}
