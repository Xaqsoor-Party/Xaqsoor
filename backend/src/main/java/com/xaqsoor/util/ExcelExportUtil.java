package com.xaqsoor.util;

import com.xaqsoor.entity.User;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ExcelExportUtil {

    public static ByteArrayInputStream usersToExcel(List<User> users, String[] columns, boolean colorCodeRows) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Users");

            // Header styling
            Row headerRow = sheet.createRow(0);
            CellStyle headerCellStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            CellStyle activeCellStyle = null;
            CellStyle inactiveCellStyle = null;
            CellStyle suspendedCellStyle = null;
            CellStyle pendingCellStyle = null;

            if (colorCodeRows) {
                activeCellStyle = workbook.createCellStyle();
                activeCellStyle.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
                activeCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                inactiveCellStyle = workbook.createCellStyle();
                inactiveCellStyle.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
                inactiveCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                suspendedCellStyle = workbook.createCellStyle();
                suspendedCellStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
                suspendedCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

                pendingCellStyle = workbook.createCellStyle();
                pendingCellStyle.setFillForegroundColor(IndexedColors.LIGHT_ORANGE.getIndex());
                pendingCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            }

            int rowIdx = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowIdx++);

                CellStyle rowCellStyle = null;
                if (colorCodeRows && user.getStatus() != null) {
                    switch (user.getStatus()) {
                        case ACTIVE -> rowCellStyle = activeCellStyle;
                        case INACTIVE -> rowCellStyle = inactiveCellStyle;
                        case SUSPENDED -> rowCellStyle = suspendedCellStyle;
                        case PENDING -> rowCellStyle = pendingCellStyle;
                    }
                }

                Cell cell0 = row.createCell(0);
                cell0.setCellValue(user.getUserId());
                if (rowCellStyle != null) cell0.setCellStyle(rowCellStyle);

                Cell cell1 = row.createCell(1);
                cell1.setCellValue(user.getFirstName());
                if (rowCellStyle != null) cell1.setCellStyle(rowCellStyle);

                Cell cell2 = row.createCell(2);
                cell2.setCellValue(user.getMiddleName() != null ? user.getMiddleName() : "");
                if (rowCellStyle != null) cell2.setCellStyle(rowCellStyle);

                Cell cell3 = row.createCell(3);
                cell3.setCellValue(user.getLastName());
                if (rowCellStyle != null) cell3.setCellStyle(rowCellStyle);

                Cell cell4 = row.createCell(4);
                cell4.setCellValue(user.getGender());
                if (rowCellStyle != null) cell4.setCellStyle(rowCellStyle);

                Cell cell5 = row.createCell(5);
                if (user.getDateOfBirth() != null) {
                    cell5.setCellValue(dateFormatter.format(user.getDateOfBirth()));
                } else {
                    cell5.setCellValue("");
                }
                if (rowCellStyle != null) cell5.setCellStyle(rowCellStyle);

                Cell cell6 = row.createCell(6);
                cell6.setCellValue(user.getEmail());
                if (rowCellStyle != null) cell6.setCellStyle(rowCellStyle);

                Cell cell7 = row.createCell(7);
                cell7.setCellValue(user.getPhone());
                if (rowCellStyle != null) cell7.setCellStyle(rowCellStyle);

                Cell cell8 = row.createCell(8);
                cell8.setCellValue(user.getStatus() != null ? user.getStatus().name() : "");
                if (rowCellStyle != null) cell8.setCellStyle(rowCellStyle);

                Cell cell9 = row.createCell(9);
                cell9.setCellValue(user.getMembershipLevel() != null ? user.getMembershipLevel().name() : "");
                if (rowCellStyle != null) cell9.setCellStyle(rowCellStyle);

                Cell cell10 = row.createCell(10);
                cell10.setCellValue(user.getRole() != null ? user.getRole().getName() : "");
                if (rowCellStyle != null) cell10.setCellStyle(rowCellStyle);

                Cell cell11 = row.createCell(11);
                if (user.getLastLogin() != null) {
                    cell11.setCellValue(dateTimeFormatter.format(user.getLastLogin()));
                } else {
                    cell11.setCellValue("");
                }
                if (rowCellStyle != null) cell11.setCellStyle(rowCellStyle);
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public static ByteArrayInputStream exportBasicUserInfo(List<User> users, String[] columns) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Phone Export");

            // Header styling
            Row headerRow = sheet.createRow(0);
            CellStyle headerCellStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            for (int col = 0; col < columns.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(columns[col]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowIdx++);

                // Full name (first + middle + last)
                String fullName = String.format("%s %s %s",
                        user.getFirstName() != null ? user.getFirstName() : "",
                        user.getMiddleName() != null ? user.getMiddleName() : "",
                        user.getLastName() != null ? user.getLastName() : ""
                ).replaceAll(" +", " ").trim();

                // Full Name
                row.createCell(0).setCellValue(fullName);

                // Phone Number
                row.createCell(1).setCellValue(user.getPhone() != null ? user.getPhone() : "");

                // Network Operator
                row.createCell(2).setCellValue(user.getNetworkOperator() != null ? user.getNetworkOperator() : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

}
