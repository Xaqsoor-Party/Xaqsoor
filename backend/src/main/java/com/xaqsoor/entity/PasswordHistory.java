package com.xaqsoor.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "password_history")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordHistory extends Auditable{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credential_id", nullable = false)
    private UserCredential credential;

    @Column(name = "old_password", nullable = false)
    private String oldPassword;
}
