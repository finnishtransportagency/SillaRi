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
        this.isLocal = isLocal;

        BridgeModel bridge = supervision.getRouteBridge().getBridge();
        RouteModel route = supervision.getRouteBridge().getRoute();
        SupervisionReportModel report = supervision.getReport();
        PermitModel permit = route.getPermit();
        SupervisorModel supervisor = ((supervision.getSupervisors() == null || supervision.getSupervisors().isEmpty()) ? null : supervision.getSupervisors().get(0));
        var images = supervision.getImages();

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

            logger.debug("messageso: + "+messageSource);
            logger.debug("messageso: + "+messageSource.getMessage("supervision.pdf.sillanvalvontaraportti",null, Locale.ROOT));
            contentStream.showText(messageSource.getMessage("supervision.pdf.sillanvalvontaraportti",null, Locale.ROOT));

            newLine();
            contentStream.setFont(PDType1Font.COURIER, 12);

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.lupanumero",null, Locale.ROOT) + permit.getPermitNumber());

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.reitin.nimi",null, Locale.ROOT) + route.getName());

            String supervisionTime = "-";
            try {
                supervisionTime = formatStatusDate(supervision, SupervisionStatusType.IN_PROGRESS);
            } catch (Exception e) {
                logger.debug("caugth: " + e.getClass().getName() + e.getMessage());
            }
            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.valvonta.aloitettu",null, Locale.ROOT) + supervisionTime);

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.silta",null, Locale.ROOT) + bridge.getName() + " | " + bridge.getIdentifier() + " | " + bridge.getOid());

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.tieosoite",null, Locale.ROOT) + (bridge.getRoadAddress() == null ? "-" : bridge.getRoadAddress()));

            String signTime = "-";
            try {
                signTime = formatStatusDate(supervision, SupervisionStatusType.REPORT_SIGNED);
            } catch (Exception e) {
                logger.debug("caugth: " + e.getClass().getName() + e.getMessage());
            }
            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.kuittauksen.ajankohta.0", null, Locale.ROOT), signTime));

            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.sillanvalvoja.2.choice.0.1.0.1", null, Locale.ROOT), supervisor.getFirstName(), supervisor.getLastName(), (supervisor == null) ? 0 : 1));

            newLine();
            newLine();
            contentStream.setFont(PDType1Font.COURIER, 14);
            contentStream.showText(messageSource.getMessage("supervision.pdf.havainnot", null, Locale.ROOT));
            newLine();

            newLine();
            contentStream.setFont(PDType1Font.COURIER, 12);
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.ajolinjaa.on.noudatettu.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getDrivingLineOk() ? 0 : 1));

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.miksi.ajolinjaa.ei.noudatettu", null, Locale.ROOT));
            newLine();

            if (report.getDrivingLineInfo() != null && !report.getDrivingLineInfo().isEmpty()) {
                for (var line : WordUtils.wrap(report.getDrivingLineInfo(), 70).lines().collect(Collectors.toList())) {
                    try {
                        logger.debug("HELLO: " + line);
                        contentStream.showText(line);
                        newLine();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }


            newLine();
            logger.debug(messageSource.getMessage("supervision.pdf.ajonopeus.on.hyvaksytty.0.choice.0.kylla.1.ei", null, Locale.ROOT));
            logger.debug(MessageFormat.format(messageSource.getMessage("supervision.pdf.ajonopeus.on.hyvaksytty.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getSpeedLimitOk() ? 0 : 1));
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.ajonopeus.on.hyvaksytty.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getSpeedLimitOk() ? 0 : 1));

            newLine();
            contentStream.showText(messageSource.getMessage("supervision.pdf.miksi.ajonopeutta.ei.hyvaksyta", null, Locale.ROOT));
            newLine();
            contentStream.showText((report.getSpeedLimitInfo() == null || report.getSpeedLimitInfo().isEmpty()) ? "-" : report.getSpeedLimitInfo());

            newLine();
            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.poikkeavia.havaintoja.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getAnomalies() ? 0 : 1));

            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.liikuntasauman.rikkoutuminen.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getJointDamage() ? 0 : 1));

            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.pysyva.taipuma.tai.muu.siirtyma.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getBendOrDisplacement() ? 0 : 1));

            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.jotain.muuta.mita.0.choice.0.kylla.1.ei", null, Locale.ROOT), report.getOtherObservations() ? 0 : 1));
            newLine();
            contentStream.showText((report.getOtherObservationsInfo() == null || report.getOtherObservationsInfo().isEmpty()) ? "" : report.getOtherObservationsInfo());
            newLine();
            contentStream.showText((report.getAnomaliesDescription() == null || report.getAnomaliesDescription().isEmpty()) ? "" : report.getAnomaliesDescription());

            newLine();
            contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.lisatiedot.0", null, Locale.ROOT), report.getAdditionalInfo()));


            contentStream.endText();
            contentStream.close();


            int imageCount = ((images == null || images.isEmpty()) ? 0 : images.size());

            if (imageCount > 0) {
                newPage();
                contentStream.showText(MessageFormat.format(messageSource.getMessage("supervision.pdf.kuvat.0.kpl", null, Locale.ROOT), imageCount));
                newLine();
                contentStream.endText();

                handleImages(supervision.getImages(), document);

                contentStream.close();
            }
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            document.save(byteArrayOutputStream);
            InputStream inputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());
            document.close();

            return IOUtils.toByteArray(inputStream);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    private void newLine() throws IOException {
        contentStream.newLineAtOffset(0, -LINE_SPACING);
        y -= LINE_SPACING;
        if (y < 20) {
            newPage();
        }
        logger.debug("" + y);
    }

    private void newPage() {
        y = page.getMediaBox().getHeight() - TOP_MARGIN;
        try {

            contentStream.endText();
        } catch (IllegalStateException | IOException e) {
            //might be ended and closed already
        }
        try {
            contentStream.close();
        } catch (IllegalStateException | IOException e) {
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
            e.printStackTrace();
        }

    }


    private void newImagePage() {
        y = page.getMediaBox().getHeight() - TOP_MARGIN;
        try {

            contentStream.endText();
        } catch (IllegalStateException | IOException e) {
            logger.debug("allready ended");
            //might be ended and closed already
        }
        try {
            contentStream.close();
        } catch (IllegalStateException | IOException e) {
            logger.debug("allready closed");
            //might be ended and closed already
        }

        try {
            page = new PDPage();
            document.addPage(page);
            contentStream = new PDPageContentStream(document, page);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private void handleImages(List<SupervisionImageModel> images, PDDocument document) {
int n=0;
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
                        e.printStackTrace();
                    }
                } else {
                    logger.debug("file no");
                }
            } else {
                //from aws s3
                byte[] imageBytes = awss3Client.download(decodedKey, awss3Client.getPhotoBucketName());
                if (imageBytes != null) {
                    try {
                        pdImage = PDImageXObject.createFromByteArray(document, imageBytes, filename);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }


            final float MAX_PHOTO_WIDTH = page.getMediaBox().getWidth() - 60;
            final float MAX_PHOTO_HEIGHT = page.getMediaBox().getHeight() - 40;

            float newWidth = pdImage.getWidth();
            float newHeight = pdImage.getHeight();

            if (pdImage.getWidth() > MAX_PHOTO_WIDTH) {
                final float ratio = pdImage.getWidth() / MAX_PHOTO_WIDTH;
                newWidth = MAX_PHOTO_WIDTH;
                newHeight = pdImage.getHeight() / ratio;
            }

            if (newHeight > MAX_PHOTO_HEIGHT) {
                final float ratio = pdImage.getHeight() / MAX_PHOTO_HEIGHT;
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
                contentStream.showText(messageSource.getMessage("kuva",null, Locale.ROOT) + n + ". " + image.getTaken());
                contentStream.endText();
                logger.debug("Drawing image at y:" + y);
                contentStream.drawImage(pdImage, 30, y, newWidth, newHeight);
                y -= 20;
            } catch (IOException e) {
                e.printStackTrace();
            }


    }

}


    @NotNull
    private String formatStatusDate(SupervisionModel supervision, SupervisionStatusType supervisionStatusType) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        return supervision.getStatusHistory().stream()
                .filter(supervisionStatusModel -> supervisionStatusModel.getStatus().equals(supervisionStatusType))
                .findFirst().orElseThrow().getTime().format(formatter);
    }


}
