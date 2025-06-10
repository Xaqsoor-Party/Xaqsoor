package com.xaqsoor.dto;

public record AcademicRecordDto(
        Long id,
        Long userId,
        String institutionName,
        String degree,
        String fieldOfStudy,
        String level,
        String location,
        Boolean currentlyStudying,
        String startDate,
        String endDate
) {
}
