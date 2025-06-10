package com.xaqsoor.mapper;

import com.xaqsoor.dto.AcademicRecordDto;
import com.xaqsoor.entity.AcademicRecord;

import java.time.format.DateTimeFormatter;

public class AcademicRecordMapper {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy");

    public static AcademicRecordDto toDto(AcademicRecord record) {
        return new AcademicRecordDto(
                record.getId(),
                record.getUser().getId(),
                record.getInstitutionName(),
                record.getDegree(),
                record.getFieldOfStudy(),
                record.getLevel().name(),
                record.getLocation(),
                record.getCurrentlyStudying(),
                record.getStartDate() != null ? record.getStartDate().format(FORMATTER) : null,
                record.getEndDate() != null ? record.getEndDate().format(FORMATTER) : null
        );
    }
}
