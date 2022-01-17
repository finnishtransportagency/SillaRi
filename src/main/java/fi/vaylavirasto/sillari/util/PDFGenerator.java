package fi.vaylavirasto.sillari.util;

import fi.vaylavirasto.sillari.aws.AWSS3Client;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.io.*;
import java.text.MessageFormat;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Component
@RequestScope
public class PDFGenerator {
    @Autowired
    AWSS3Client awss3Client;

    @Autowired
    MessageSource messageSource;

    public static final int TOP_MARGIN = 50;
    private static final Logger logger = LogManager.getLogger();
    private  boolean isLocal;


    private PDDocument document;
    private PDPageContentStream contentStream;

    private float y;
    private static final float LINE_SPACING = 15;
    private PDPage page;

    public PDFGenerator() {
    }

    public byte[] generateReportPDF(SupervisionModel supervision, boolean isLocal) {
        logger.debug("hello gen pdf: " + System.identityHashCode(this));
        this.isLocal = isLocal;

        BridgeModel bridge = supervision.getRouteBridge().getBridge();
        RouteModel route = supervision.getRouteBridge().getRoute();
        SupervisionReportModel report = supervision.getReport();
        PermitModel permit = route.getPermit();
        // TODO get the supervisor who has finished the report
        SupervisorModel supervisor = ((supervision.getSupervisors() == null || supervision.getSupervisors().isEmpty()) ? null : supervision.getSupervisors().get(0));
        List<SupervisionImageModel> images = supervision.getImages();

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

            contentStream.showText(messageSource.getMessage("supervision.pdf.title",null, Locale.ROOT));

            newLine();
            contentStream.setFont(PDType1Font.COURIER, 12);

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.permit.number",null, Locale.ROOT) + permit.getPermitNumber());

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.route.name",null, Locale.ROOT) + route.getName());

            String supervisionTime = formatStatusDate(supervision, SupervisionStatusType.IN_PROGRESS);

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.supervision.start.time",null, Locale.ROOT) + supervisionTime);

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.bridge",null, Locale.ROOT) + bridge.getName() + " | " + bridge.getIdentifier() + " | " + bridge.getOid());

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.road.address",null, Locale.ROOT) + (bridge.getRoadAddress() == null ? "-" : bridge.getRoadAddress()));

            String signTime = formatStatusDate(supervision, SupervisionStatusType.REPORT_SIGNED);

            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.sign.time.0", null, Locale.ROOT), signTime));

            newLine();
            String supervisorFirstName = supervisor != null ? supervisor.getFirstName() : "";
            String supervisorLastName = supervisor != null ? supervisor.getLastName() : "";
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.supervisor.2.choice.0.1.0.1", null, Locale.ROOT), supervisorFirstName, supervisorLastName, (supervisor == null) ? 0 : 1));

            newLine();
            newLine();
            contentStream.setFont(PDType1Font.COURIER, 14);
            contentStream.showText(messageSource.getMessage("supervision.pdf.observations", null, Locale.ROOT));
            newLine();

            newLine();
            contentStream.setFont(PDType1Font.COURIER, 12);
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.driving.line.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getDrivingLineOk() ? 0 : 1));

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.driving.line.reason", null, Locale.ROOT));
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
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.speed.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getSpeedLimitOk() ? 0 : 1));

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.speed.reason", null, Locale.ROOT));
            newLine();
            contentStream.showText((report.getSpeedLimitInfo() == null || report.getSpeedLimitInfo().isEmpty()) ? "-" : report.getSpeedLimitInfo());

            newLine();
            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.anomalies.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getAnomalies() ? 0 : 1));

            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.joint.damage.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getJointDamage() ? 0 : 1));

            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.bend.or.displacement.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getBendOrDisplacement() ? 0 : 1));

            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.other.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getOtherObservations() ? 0 : 1));
            newLine();
            contentStream.showText((report.getOtherObservationsInfo() == null || report.getOtherObservationsInfo().isEmpty()) ? "" : report.getOtherObservationsInfo());
            newLine();
            contentStream.showText((report.getAnomaliesDescription() == null || report.getAnomaliesDescription().isEmpty()) ? "" : report.getAnomaliesDescription());

            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.additional.info.0", null, Locale.ROOT), report.getAdditionalInfo()));


            contentStream.endText();
            contentStream.close();


            int imageCount = ((images == null || images.isEmpty()) ? 0 : images.size());

            if (imageCount > 0) {
                newPage();
                contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.photos.0.kpl", null, Locale.ROOT), imageCount));
                newLine();
                contentStream.endText();

                handleImages(supervision.getImages(), document);

                contentStream.close();
            }
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            document.save(byteArrayOutputStream);
            InputStream inputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
            document.close();

            logger.debug("pdf success");
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

    private void handleImages(List<SupervisionImageModel> images, PDDocument document) {
        int n = 0;
        for (SupervisionImageModel image : images) {
            n++;
            String objectKey = image.getObjectKey();
            String decodedKey = new String(Base64.getDecoder().decode(objectKey));
            PDImageXObject pdImage = null;

            String filename = decodedKey.substring(decodedKey.lastIndexOf("/"));

            if (isLocal) {
                // Get from local file system
                File inputFile = new File("/", filename);
                if (inputFile.exists()) {

                    try {
                        pdImage = PDImageXObject.createFromFile(inputFile.getPath(), document);
                    } catch (IOException e) {
                        logger.error("Local image creation failed: " + e.getClass().getName() + e.getMessage());
                    }
                } else {
                    logger.debug("No local input file");
                }
            } else {
                //from aws s3
                byte[] imageBytes = awss3Client.download(decodedKey, awss3Client.getPhotoBucketName());
                if (imageBytes != null) {
                    try {
                        pdImage = PDImageXObject.createFromByteArray(document, imageBytes, filename);
                    } catch (IOException e) {
                        logger.error("Image creation from AWS failed: " + e.getClass().getName() + e.getMessage());
                    }
                }
            }


            final float MAX_PHOTO_WIDTH = page.getMediaBox().getWidth() - 60;
            final float MAX_PHOTO_HEIGHT = page.getMediaBox().getHeight() - 40;

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
                newWidth = newWidth / ratio;
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
                contentStream.showText(messageSource.getMessage("supervision.pdf.photo",null, Locale.ROOT) + n + ". " + image.getTaken());
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


}
