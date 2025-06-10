package com.xaqsoor.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "user_credentials")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCredential extends Auditable {
    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonProperty("user_id")
    private User user;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "revoked", nullable = false)
    private boolean revoked = false;

    @Column(name = "is_temporary_password", nullable = false)
    private boolean isTemporaryPassword = true;

    @OneToMany(mappedBy = "credential", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PasswordHistory> passwordHistory;

    public boolean isCredentialsNonExpired() {
        return getCreatedDate().plusMonths(3).isAfter(LocalDateTime.now());
    }
}
