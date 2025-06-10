package com.xaqsoor.service.impl;

import com.xaqsoor.dto.AcademicRecordDto;
import com.xaqsoor.dto.request.AcademicRecordRequest;
import com.xaqsoor.dto.response.AcademicRecordListDto;
import com.xaqsoor.entity.AcademicRecord;
import com.xaqsoor.entity.User;
import com.xaqsoor.enumeration.EducationLevel;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.mapper.AcademicRecordMapper;
import com.xaqsoor.repository.AcademicRecordRepository;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.service.AcademicRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class AcademicRecordServiceImpl implements AcademicRecordService {
    private final AcademicRecordRepository academicRecordRepository;
    private final UserRepository userRepository;

    @Override
    public AcademicRecordListDto getAllByUserId(Long userId) {
        List<AcademicRecord> academicRecordList = academicRecordRepository.findByUserIdOrderByStartDateDesc(userId);

        List<AcademicRecordDto> academicRecordListDtoList = academicRecordList.stream()
                .map(AcademicRecordMapper::toDto)
                .toList();
        return new AcademicRecordListDto(academicRecordListDtoList);
    }

    @Override
    public AcademicRecordDto saveOrUpdate(Long userId, AcademicRecordRequest request) {
        User user = getUserOrThrow(userId);
        AcademicRecord academicRecord = AcademicRecord.builder()
                .user(user)
                .institutionName(request.institutionName())
                .degree(request.degree())
                .fieldOfStudy(request.fieldOfStudy())
                .level(EducationLevel.fromString(request.level()))
                .location(request.location())
                .currentlyStudying(request.currentlyStudying())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .build();
        AcademicRecord saved = academicRecordRepository.save(academicRecord);
        return AcademicRecordMapper.toDto(saved);
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found."));
    }
}
