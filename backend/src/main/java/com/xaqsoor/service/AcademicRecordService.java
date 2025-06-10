package com.xaqsoor.service;

import com.xaqsoor.dto.AcademicRecordDto;
import com.xaqsoor.dto.request.AcademicRecordRequest;
import com.xaqsoor.dto.response.AcademicRecordListDto;

public interface AcademicRecordService {
    AcademicRecordListDto getAllByUserId(Long userId);
    AcademicRecordDto saveOrUpdate(Long userId, AcademicRecordRequest academicRecordRequest);
}
