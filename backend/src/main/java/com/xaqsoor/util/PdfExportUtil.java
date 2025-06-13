package com.xaqsoor.util;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.ColumnText;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.PageSize;

import java.awt.Color;
import com.xaqsoor.entity.User;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class PdfExportUtil {

    // Custom event for adding footer
    static class FooterEvent extends PdfPageEventHelper {
        private static final Font FOOTER_FONT = new Font(Font.HELVETICA, 9, Font.ITALIC, new Color(100, 100, 100));

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            Phrase footer = new Phrase("Provided by Asal Solutions", FOOTER_FONT);
            float centerX = document.getPageSize().getWidth() / 2;
            float footerY = 30; // Position 30 points from bottom
            ColumnText.showTextAligned(
                    writer.getDirectContent(),
                    Element.ALIGN_CENTER,
                    footer,
                    centerX,
                    footerY,
                    0
            );
        }
    }

    public static ByteArrayInputStream usersToPdf(List<User> users, String[] columns) throws IOException {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter writer = PdfWriter.getInstance(document, out);
            writer.setPageEvent(new FooterEvent()); // Register footer
            document.open();

            // Title styling
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, new Color(50, 50, 150));
            Paragraph title = new Paragraph("User List Export", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(25);
            document.add(title);

            // Table setup
            PdfPTable table = new PdfPTable(columns.length);
            table.setWidthPercentage(100);
            table.setSpacingBefore(15f);
            table.setSpacingAfter(20f);

            // Header styling
            Color headerBgColor = new Color(70, 130, 180);
            Font headerFont = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);

            for (String column : columns) {
                PdfPCell headerCell = new PdfPCell(new Phrase(column, headerFont));
                headerCell.setBackgroundColor(headerBgColor);
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                headerCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                headerCell.setPadding(8);
                headerCell.setBorderWidth(1.2f);
                table.addCell(headerCell);
            }

            // Data row styling
            Font dataFont = new Font(Font.HELVETICA, 9);

            for (User user : users) {
                // Add user data cells (all with white background)
                addCell(table, user.getUserId(), dataFont, Element.ALIGN_LEFT);
                addCell(table, user.getFirstName(), dataFont, Element.ALIGN_LEFT);
                addCell(table, user.getMiddleName(), dataFont, Element.ALIGN_LEFT);
                addCell(table, user.getLastName(), dataFont, Element.ALIGN_LEFT);
                addCell(table, user.getGender(), dataFont, Element.ALIGN_LEFT);
                addCell(table, user.getEmail(), dataFont, Element.ALIGN_LEFT);
                addCell(table, user.getPhone(), dataFont, Element.ALIGN_LEFT);
                addCell(table, user.getStatus() != null ? user.getStatus().name() : "", dataFont, Element.ALIGN_LEFT);
                addCell(table, user.getMembershipLevel() != null ? user.getMembershipLevel().getValue() : "", dataFont, Element.ALIGN_LEFT);
                addCell(table, user.getRole() != null ? user.getRole().getName() : "", dataFont, Element.ALIGN_LEFT);
            }

            document.add(table);
            document.close();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            System.err.println("PDF Generation Error: " + e.getMessage());
            throw new IOException("PDF export failed", e);
        }
    }

    // Helper: Add styled data cell
    private static void addCell(PdfPTable table, String content, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(content != null ? content : "", font));
        cell.setPadding(6);
        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderWidth(0.8f);
        cell.setBackgroundColor(Color.WHITE); // Explicit white background
        table.addCell(cell);
    }
}