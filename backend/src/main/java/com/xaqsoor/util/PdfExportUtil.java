package com.xaqsoor.util;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.*;
import com.xaqsoor.entity.User;
import com.xaqsoor.exception.ApiException;

import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class PdfExportUtil {

    static class HeaderFooterEvent extends PdfPageEventHelper {
        private static final Font FOOTER_FONT = new Font(Font.HELVETICA, 9, Font.ITALIC, new Color(100, 100, 100));
        private static final Font ORG_NAME_FONT = new Font(Font.HELVETICA, 16, Font.BOLD, new Color(30, 70, 120));
        private static final Font TITLE_FONT = new Font(Font.HELVETICA, 14, Font.BOLD, new Color(50, 50, 50));
        private static final Font DATE_FONT = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(80, 80, 80));

        private final Image logo;
        private final String preparedDate;
        private boolean headerAdded = false;

        public HeaderFooterEvent(Image logo, String preparedDate) {
            this.logo = logo;
            this.preparedDate = preparedDate;
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            addFooter(writer, document);
            try {
                if (!headerAdded && writer.getPageNumber() == 1) {
                    addHeader(writer, document);
                    headerAdded = true;
                    document.setMargins(document.leftMargin(), document.rightMargin(), 0, document.bottomMargin());
                }
            } catch (DocumentException e) {
                throw new ApiException("Failed to add header to PDF", e);
            }
        }

        private void addHeader(PdfWriter writer, Document document) throws DocumentException {
            PdfContentByte cb = writer.getDirectContent();
            float leftX = document.left() + 10;
            float pageHeight = writer.getPageSize().getHeight();

            float textStartRefY;
            if (logo != null) {
                float logoActualHeight = logo.getScaledHeight();
                float logoPaddingFromTop = 30f;
                float logoYBottom = pageHeight - logoPaddingFromTop - logoActualHeight;
                logo.setAbsolutePosition(leftX, logoYBottom);
                cb.addImage(logo);
                textStartRefY = logoYBottom - 20f;
            } else {
                textStartRefY = pageHeight - 100f;
            }

            ColumnText.showTextAligned(
                    cb,
                    Element.ALIGN_LEFT,
                    new Phrase("Xaqsoor", ORG_NAME_FONT),
                    leftX,
                    textStartRefY,
                    0
            );

            ColumnText.showTextAligned(
                    cb,
                    Element.ALIGN_LEFT,
                    new Phrase("Organization Member List", TITLE_FONT),
                    leftX,
                    textStartRefY - 25,
                    0
            );

            ColumnText.showTextAligned(
                    cb,
                    Element.ALIGN_LEFT,
                    new Phrase("Prepared on: " + preparedDate, DATE_FONT),
                    leftX,
                    textStartRefY - 50,
                    0
            );
        }

        private void addFooter(PdfWriter writer, Document document) {
            PdfContentByte cb = writer.getDirectContent();

            // Left side text
            Phrase footerLeft = new Phrase("Provided by Asal Solutions", FOOTER_FONT);
            float leftX = document.leftMargin();  // Left margin position
            float footerY = 30;                   // Y position of footer text
            ColumnText.showTextAligned(cb, Element.ALIGN_LEFT, footerLeft, leftX, footerY, 0);

            // Right side page number
            int pageNumber = writer.getPageNumber();
            Phrase footerRight = new Phrase("Page " + pageNumber, FOOTER_FONT);
            float rightX = document.getPageSize().getWidth() - document.rightMargin(); // Right margin position
            ColumnText.showTextAligned(cb, Element.ALIGN_RIGHT, footerRight, rightX, footerY, 0);
        }

    }

    public static ByteArrayInputStream usersToPdf(List<User> users) throws IOException {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter writer = PdfWriter.getInstance(document, out);

            Image logo = loadLogo();

            String preparedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd,yyyy"));
            writer.setPageEvent(new HeaderFooterEvent(logo, preparedDate));

            float topMargin = 30f + logo.getScaledHeight() + 20f + 50f + 20f;
            document.setMargins(document.leftMargin(), document.rightMargin(), topMargin, document.bottomMargin());

            document.open();

            String[] memberHeaders = {
                    "User ID", "First Name", "Middle Name", "Last Name",
                    "Email", "Phone", "Membership Level"
            };

            PdfPTable table = new PdfPTable(memberHeaders.length);
            table.setWidthPercentage(100);
            table.setSpacingBefore(20f);
            // Disable header repetition
            table.setHeaderRows(0);

            // Add header cells
            for (String header : memberHeaders) {
                PdfPCell cell = new PdfPCell(new Phrase(header));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setBackgroundColor(new Color(230, 240, 250));
                cell.setPadding(8);
                cell.setBorderWidth(1.2f);
                table.addCell(cell);
            }

            // Add data rows
            Font dataFont = new Font(Font.HELVETICA, 10);
            for (User user : users) {
                table.addCell(createCell(user.getUserId(), dataFont));
                table.addCell(createCell(user.getFirstName(), dataFont));
                table.addCell(createCell(user.getMiddleName(), dataFont));
                table.addCell(createCell(user.getLastName(), dataFont));
                table.addCell(createCell(user.getEmail(), dataFont));
                table.addCell(createCell(user.getPhone(), dataFont));
                table.addCell(createCell(
                        user.getMembershipLevel() != null ? user.getMembershipLevel().getValue() : "",
                        dataFont
                ));
            }

            document.add(table);
            document.close();

            return new ByteArrayInputStream(out.toByteArray());
        } catch (DocumentException e) {
            throw new ApiException("PDF generation failed", e);
        }
    }

    private static PdfPCell createCell(String content, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(content != null ? content : "", font));
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderWidth(0.8f);
        return cell;
    }

    private static Image loadLogo() throws BadElementException {
        java.net.URL logoUrl = PdfExportUtil.class.getClassLoader().getResource("static/images/Logo.png");
        if (logoUrl == null) {
            throw new ApiException("Logo resource not found at 'static/images/Logo.png'");
        }

        try {
            Image logo = Image.getInstance(logoUrl);
            logo.scaleToFit(180, 180);
            return logo;
        } catch (BadElementException | IOException e) {
            throw new ApiException("Failed to load or process logo image", e);
        }
    }

}