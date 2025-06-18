package com.xaqsoor.dto.Dashboard;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record TimeRangeRequest  (
        @NotNull(message = "Range must not be null")
        Range range,
        LocalDate startDate,
        LocalDate endDate
){
}
