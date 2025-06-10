package com.xaqsoor.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.xaqsoor.domain.RequestContext;
import com.xaqsoor.exception.ApiException;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

import static com.xaqsoor.util.UniqueIdGenerator.generateTimestampBased;

@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties(value = {"createdDate", "modifiedDate"}, allowGetters = true)
@MappedSuperclass
@Getter
@Setter
public abstract class Auditable {
    @Id
    @SequenceGenerator(name = "id_seq", sequenceName = "id_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "id_seq")
    private Long id;

    @Column(name = "reference_id", nullable = false, unique = true)
    private String referenceId = generateTimestampBased();

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name = "created_by", updatable = false)
    private Long createdBy;

    @Column(name = "modified_by", insertable = false)
    private Long modifiedBy;

    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "modified_date", insertable = false)
    private LocalDateTime modifiedDate;

    @PrePersist
    public void onPrePersist() {
        if (this.referenceId == null) {
            this.referenceId = generateTimestampBased();
        }
        this.createdBy = getCurrentUser();
    }

    @PreUpdate
    public void onPreUpdate() {
        setModifiedBy(getCurrentUser());
    }

    private Long getCurrentUser() {
        Long userId = RequestContext.getUserId();
        if (userId == null) {
            throw new ApiException("User ID cannot be null before performing the operation.");
        }
        return userId;
    }
}