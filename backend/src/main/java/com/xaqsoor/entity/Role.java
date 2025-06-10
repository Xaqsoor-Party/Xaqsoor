package com.xaqsoor.entity;

import com.xaqsoor.enumeration.Authority;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends Auditable{
    @Column(name = "name", nullable = false, unique = true, length = 30)
    private String name;

    @Column(name = "authorities", length = 500)
    private Authority authorities;

}
