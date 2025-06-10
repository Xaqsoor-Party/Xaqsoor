package com.xaqsoor.projections;


import com.xaqsoor.enumeration.ConfirmationType;

import java.time.LocalDateTime;

public interface ConfirmationProjection {
    String getKey();
    String getEmail();
    String getFirstName();
    String getMiddleName();
    String getLastName();
    ConfirmationType getType();
    LocalDateTime getExpiryDate();
}
