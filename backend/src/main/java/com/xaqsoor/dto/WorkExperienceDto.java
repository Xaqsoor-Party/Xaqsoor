package com.xaqsoor.dto;

public record WorkExperienceDto(
        Long id,
        String jobTitle,
        String companyName,
        String location,
        String startDate,
        String endDate,
        Boolean currentlyWorking,
        String description
) {
}
