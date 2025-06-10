package com.xaqsoor.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.xaqsoor.enumeration.ConfirmationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "confirmations", uniqueConstraints = @UniqueConstraint(name = "unique_confirmation_key", columnNames = "confirmation_key"))
@Getter
@Setter
@NoArgsConstructor
public class Confirmation extends Auditable {
    @Column(name = "confirmation_key", nullable = false, unique = true, updatable = false)
    private String key;

    @ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class, property = "id")
    @JsonIdentityReference(alwaysAsId = true)
    @JsonProperty("user_id")
    private User user;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ConfirmationType type;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    public Confirmation(User user, ConfirmationType type, LocalDateTime expiryDate) {
        this.key = generateTripleUUIDKey();
        this.user = user;
        this.type = type;
        this.expiryDate = expiryDate;
    }

    public boolean hasExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }

    private static String generateTripleUUIDKey() {
        return UUID.randomUUID().toString().replace("-", "")
                + UUID.randomUUID().toString().replace("-", "")
                + UUID.randomUUID().toString().replace("-", "");
    }

}
