package fi.vaylavirasto.sillari.util;

import fi.vaylavirasto.sillari.model.*;
import org.apache.commons.io.IOUtils;
import org.apache.commons.text.WordUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.jetbrains.annotations.NotNull;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.MessageFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public class PDFGenerator {

    public static final String pdf_title = "Sillanvalvontaraportti";
    public static final String pdf_permit_number = "Lupanumero: ";
    public static final String pdf_route_name = "Reitin nimi: ";
    public static final String pdf_supervision_start_time = "Valvonta aloitettu: ";
    public static final String pdf_bridge = "Silta: ";
    public static final String pdf_road_address = "Tieosoite: ";
    public static final String pdf_observations = "Havainnot";
    public static final String pdf_driving_line_reason = "Miksi ajolinjaa ei noudatettu:";
    public static final String pdf_speed_reason = "Miksi ajonopeutta ei noudatettu:";
    public static final String pdf_sign_time = "Kuittauksen ajankohta: {0}";
    public static final String pdf_supervisor = "Sillanvalvoja: ";
    public static final String pdf_driving_line = "Ajolinjaa on noudatettu: {0, choice, 0#kyllä|1#ei}";
    public static final String pdf_speed = "Ajonopeutta on noudatettu: {0, choice, 0#kyllä|1#ei}";
    public static final String pdf_anomalies = "Poikkeavia havaintoja: {0, choice, 0#kyllä|1#ei}";
    public static final String pdf_joint_damage = "Liikuntasauman rikkoutuminen: {0, choice, 0#kyllä|1#ei}";
    public static final String pdf_bend_or_displacement = "Pysyvä taipuma tai muu siirtymä: {0, choice, 0#kyllä|1#ei}";
    public static final String pdf_other = "Jotain muuta, mitä? {0, choice, 0#kyllä|1#ei}";
    public static final String pdf_additional_info = "Lisätiedot: {0}";
    public static final String pdf_photos_kpl = "Valokuvat ({0}kpl)";
    public static final String pdf_photo = "kuva";

    public static final int TOP_MARGIN = 50;
    private static final Logger logger = LogManager.getLogger();


    private PDDocument document;
    private PDPageContentStream contentStream;

    private float y;
    private static final float LINE_SPACING = 15;
    private PDPage page;

    public PDFGenerator() {
    }

    public byte[] generateReportPDF(SupervisionModel supervision, List<byte[]> images) {


        logger.debug("Generate pdf for supervision {}", supervision);
        BridgeModel bridge = supervision.getRouteBridge().getBridge();
        RouteModel route = supervision.getRouteBridge().getRoute();
        SupervisionReportModel report = supervision.getReport();
        PermitModel permit = route.getPermit();

        document = new PDDocument();
        page = new PDPage();
        document.addPage(page);

        y = page.getMediaBox().getHeight() - TOP_MARGIN;


        try {

            contentStream = new PDPageContentStream(document, page);

            contentStream.beginText();
            contentStream.setFont(PDType1Font.COURIER, 16);


            contentStream.setLeading(12 * 1.2f);
            contentStream.newLineAtOffset(50, y);

            contentStream.showText(pdf_title);

            newLine();
            contentStream.setFont(PDType1Font.COURIER, 12);

            newLine();
            contentStream.showText(pdf_permit_number + permit.getPermitNumber());

            newLine();
            contentStream.showText(pdf_route_name + route.getName());

            String supervisionTime = formatStatusDate(supervision, SupervisionStatusType.IN_PROGRESS);

            newLine();
            contentStream.showText(pdf_supervision_start_time + supervisionTime);

            newLine();
            contentStream.showText(pdf_bridge + bridge.getName() + " | " + bridge.getIdentifier() + " | " + bridge.getOid());

            newLine();
            contentStream.showText(pdf_road_address + (bridge.getRoadAddress() == null ? "-" : bridge.getRoadAddress()));

            String signTime = formatStatusDate(supervision, SupervisionStatusType.REPORT_SIGNED);

            newLine();
            contentStream.showText(MessageFormat.format(pdf_sign_time, signTime));

            // TODO add supervisor company instead
            /*newLine();
            contentStream.showText(pdf_supervisor + deduceSupervisorWhoSupervisedWholeName(supervision));*/

            newLine();
            newLine();
            contentStream.setFont(PDType1Font.COURIER, 14);
            contentStream.showText(pdf_observations);
            newLine();

            newLine();
            contentStream.setFont(PDType1Font.COURIER, 12);
            contentStream.showText(MessageFormat.format(pdf_driving_line, report.getDrivingLineOk() ? 0 : 1));

            newLine();
            contentStream.showText(pdf_driving_line_reason);
            newLine();

            if (report.getDrivingLineInfo() != null && !report.getDrivingLineInfo().isEmpty()) {
                for (String line : WordUtils.wrap(report.getDrivingLineInfo(), 70).lines().collect(Collectors.toList())) {
                    try {
                        contentStream.showText(line);
                        newLine();
                    } catch (IOException e) {
                        logger.debug("caught: " + e.getClass().getName() + e.getMessage());
                    }
                }
            }


            newLine();
            contentStream.showText(MessageFormat.format(pdf_speed, report.getSpeedLimitOk() ? 0 : 1));

            newLine();
            contentStream.showText(pdf_speed_reason);
            newLine();
            contentStream.showText((report.getSpeedLimitInfo() == null || report.getSpeedLimitInfo().isEmpty()) ? "-" : report.getSpeedLimitInfo());

            newLine();
            newLine();
            contentStream.showText(MessageFormat.format(pdf_anomalies, report.getAnomalies() ? 0 : 1));

            newLine();
            contentStream.showText(MessageFormat.format(pdf_joint_damage, report.getJointDamage() ? 0 : 1));

            newLine();
            contentStream.showText(MessageFormat.format(pdf_bend_or_displacement, report.getBendOrDisplacement() ? 0 : 1));

            newLine();
            contentStream.showText(MessageFormat.format(pdf_other, report.getOtherObservations() ? 0 : 1));
            newLine();
            contentStream.showText((report.getOtherObservationsInfo() == null || report.getOtherObservationsInfo().isEmpty()) ? "" : report.getOtherObservationsInfo());
            newLine();
            contentStream.showText((report.getAnomaliesDescription() == null || report.getAnomaliesDescription().isEmpty()) ? "" : report.getAnomaliesDescription());

            newLine();
            contentStream.showText(MessageFormat.format(pdf_additional_info, report.getAdditionalInfo()));


            contentStream.endText();
            contentStream.close();

            List<SupervisionImageModel> imageMetadatas = supervision.getImages();
            int imageCount = ((imageMetadatas == null || imageMetadatas.isEmpty()) ? 0 : imageMetadatas.size());

            if (imageCount > 0) {
                newPage();
                contentStream.showText(MessageFormat.format(pdf_photos_kpl, imageCount));
                newLine();
                contentStream.endText();

                try {
                    handleImages(imageMetadatas, images, document);
                } catch (Exception e) {
                    // TODO what to do?
                    logger.error("caughth: " + e.getClass().getName() + e.getMessage());
                }

                try {
                    contentStream.close();
                } catch (Exception e) {
                    // TODO what to do?
                    logger.error("caughth: " + e.getClass().getName() + e.getMessage());
                }
            }
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            document.save(byteArrayOutputStream);
            InputStream inputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
            document.close();

            logger.debug("Generated pdf");
            return IOUtils.toByteArray(inputStream);

        } catch (Exception e) {
            // TODO what to do?
            logger.error("PDF generation failed: " + e.getClass().getName() + e.getMessage());
        }

        return null;
    }

    private void newLine() throws IOException {
        contentStream.newLineAtOffset(0, -LINE_SPACING);
        y -= LINE_SPACING;
        if (y < 20) {
            newPage();
        }
    }

    private void newPage() {
        y = page.getMediaBox().getHeight() - TOP_MARGIN;
        try {
            contentStream.endText();
        } catch (IllegalStateException | IOException ignored) {
            //might be ended and closed already
        }
        try {
            contentStream.close();
        } catch (IllegalStateException | IOException ignored) {
            //might be ended and closed already
        }

        try {
            page = new PDPage();
            document.addPage(page);
            contentStream = new PDPageContentStream(document, page);
            contentStream.beginText();
            contentStream.setFont(PDType1Font.COURIER, 12);
            contentStream.newLineAtOffset(50, y);


        } catch (IOException e) {
            logger.error("New page failed: " + e.getClass().getName() + e.getMessage());
        }

    }


    private void newImagePage() {
        y = page.getMediaBox().getHeight() - TOP_MARGIN;
        try {
            contentStream.endText();
        } catch (IllegalStateException | IOException ignored) {
            //might be ended and closed already
        }
        try {
            contentStream.close();
        } catch (IllegalStateException | IOException ignored) {
            //might be ended and closed already
        }

        try {
            page = new PDPage();
            document.addPage(page);
            contentStream = new PDPageContentStream(document, page);
        } catch (IOException e) {
            logger.error("New image page failed: " + e.getClass().getName() + e.getMessage());
        }

    }

    private void handleImages(List<SupervisionImageModel> imageModels, List<byte[]> images, PDDocument document) {
        int n = 0;
        for (SupervisionImageModel imageData : imageModels) {
            PDImageXObject pdImage = null;
            byte[] imageBytes = null;
            try {
                imageBytes = images.get(n);
            } catch (IndexOutOfBoundsException indexOutOfBoundsException) {
                logger.error("No corresponding image bytes for metadata " + imageData.getFilename());
            }
            if (imageBytes != null) {
                try {
                    pdImage = PDImageXObject.createFromByteArray(document, imageBytes, imageData.getFilename());
                } catch (IOException e) {
                    logger.error("Image creation from AWS failed: " + e.getClass().getName() + e.getMessage());
                }
            }
            n++;


            final float MAX_PHOTO_WIDTH = page.getMediaBox().getWidth() - 60;
            final float MAX_PHOTO_HEIGHT = page.getMediaBox().getHeight() - 150;

            float imageWidth = pdImage != null ? pdImage.getWidth() : 0;
            float imageHeight = pdImage != null ? pdImage.getHeight() : 0;

            float newWidth = imageWidth;
            float newHeight = imageHeight;


            if (imageWidth > MAX_PHOTO_WIDTH) {
                final float ratio = imageWidth / MAX_PHOTO_WIDTH;
                newWidth = MAX_PHOTO_WIDTH;
                newHeight = imageHeight / ratio;
            }

            if (newHeight > MAX_PHOTO_HEIGHT) {
                final float ratio = imageHeight / MAX_PHOTO_HEIGHT;
                newWidth = imageWidth / ratio;
                newHeight = MAX_PHOTO_HEIGHT;
            }


            y -= 20 + newHeight;
            if (y <= 20) {
                newImagePage();
                y -= 20 + newHeight;
            }
            try {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.COURIER, 12);
                contentStream.newLineAtOffset(50, y - 20);
                contentStream.showText(pdf_photo + n + ". " + imageData.getTaken());
                contentStream.endText();

                contentStream.drawImage(pdImage, 30, y, newWidth, newHeight);
                y -= 20;
            } catch (IOException e) {
                logger.error("Draw image failed: " + e.getClass().getName() + e.getMessage());
            }


        }

    }


    @NotNull
    private String formatStatusDate(SupervisionModel supervision, SupervisionStatusType supervisionStatusType) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
            return supervision.getStatusHistory().stream()
                    .filter(supervisionStatusModel -> supervisionStatusModel.getStatus().equals(supervisionStatusType))
                    .findFirst().orElseThrow().getTime().format(formatter);
        } catch (Exception e) {
            logger.debug("caught: " + e.getClass().getName() + e.getMessage());
            return "-";
        }
    }

    // TODO remove when supervisor company is available
    /*private String deduceSupervisorWhoSupervisedWholeName(SupervisionModel supervision) {

        SupervisorModel supervisor = supervision.getSupervisorWhoSupervised();
        String supervisorFirstName = supervisor != null ? supervisor.getFirstName() : "";
        String supervisorLastName = supervisor != null ? supervisor.getLastName() : "";
        return supervisorFirstName + " " + supervisorLastName;

    }*/


}
