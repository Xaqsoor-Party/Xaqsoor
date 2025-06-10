package com.xaqsoor.entity;

import com.xaqsoor.enumeration.EducationLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "academic_record")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AcademicRecord extends Auditable{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "institution_name", nullable = false, length = 150)
    private String institutionName;

    @Column(name = "degree", length = 100)
    private String degree;

    @Column(name = "field_of_study", length = 100, nullable = false)
    private String fieldOfStudy;

    @Enumerated(EnumType.STRING)
    @Column(name = "level", length = 50 , nullable = false )
    private EducationLevel level;

    @Column(name = "location", length = 100 , nullable = false)
    private String location;

    @Column(name = "currently_studying", nullable = false)
    private Boolean currentlyStudying = false;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}
