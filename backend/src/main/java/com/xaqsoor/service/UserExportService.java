package com.xaqsoor.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;

public interface UserExportService {
    ByteArrayInputStream exportUsersToExcel(String searchTerm,
                                            String statusFilter,
                                            String roleFilter,
                                            String genderFilter,
                                            String membershipLevelFilter,
                                            boolean colorCodeRows) throws IOException;

    ByteArrayInputStream exportUsersToPdf(String searchTerm,
                                          String status,
                                          String role,
                                          String gender,
                                          String membershipLevel) throws IOException;

    long countUsersByFilters(String searchTerm,
                             String statusFilter,
                             String roleFilter,
                             String genderFilter,
                             String membershipLevelFilter);
}
