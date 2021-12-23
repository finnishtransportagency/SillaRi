package fi.vaylavirasto.sillari.util;

import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.service.SupervisionImageService;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;

@Service
public class PDFGenerator {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    SupervisionImageService supervisionImageService;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;
    private PDDocument document;


    private float y;

    public byte[] generateReportPDF(SupervisionModel supervision) {


        BridgeModel bridge = supervision.getRouteBridge().getBridge();
        RouteModel route = supervision.getRouteBridge().getRoute();
        SupervisionReportModel report = supervision.getReport();
        PermitModel permit = route.getPermit();
        SupervisorModel supervisor = ((supervision.getSupervisors() == null || supervision.getSupervisors().isEmpty()) ? null : supervision.getSupervisors().get(0));
        var images = supervisionImageService.getSupervisionImages(supervision.getId());

        document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        final float pageHeight = page.getMediaBox().getHeight();
        final float pageWidth = page.getMediaBox().getWidth();

        logger.debug("pageHeight: " + pageHeight);

        y = pageHeight - 50;
        float lineSpacing = 15;

        try {
            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            contentStream.beginText();
            contentStream.setFont(PDType1Font.COURIER, 16);


            contentStream.setLeading(12 * 1.2f);
            contentStream.newLineAtOffset(50, y);

            contentStream.showText("Sillanvalvontaraportti");

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.setFont(PDType1Font.COURIER, 12);

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Lupanumero: " + permit.getPermitNumber());

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Reitin nimi: " + route.getName());

            String supervisionTime = "-";
            try {
                supervisionTime = formatStatusDate(supervision, SupervisionStatusType.IN_PROGRESS);
            } catch (Exception e) {
                logger.debug("caugth: " + e.getClass().getName() + e.getMessage());
            }
            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Valvonta aloitettu: " + supervisionTime);

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Silta: " + bridge.getName() + " | " + bridge.getIdentifier() + " | " + bridge.getOid());

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Tieosoite: " + (bridge.getRoadAddress() == null ? "-" : bridge.getRoadAddress()));

            String signTime = "-";
            try {
                signTime = formatStatusDate(supervision, SupervisionStatusType.REPORT_SIGNED);
            } catch (Exception e) {
                logger.debug("caugth: " + e.getClass().getName() + e.getMessage());
            }
            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Kuittauksen ajankohta: " + signTime);

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Sillanvalvoja: " + ((supervisor == null) ? "-" : supervisor.getFirstName() + " " + supervisor.getLastName()));

            newLineAtOffset(contentStream, 0, -lineSpacing);
            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.setFont(PDType1Font.COURIER, 14);
            contentStream.showText("Havainnot");
            newLineAtOffset(contentStream, 0, -lineSpacing);

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.setFont(PDType1Font.COURIER, 12);
            contentStream.showText("Ajolinjaa on noudatettu: " + (report.getDrivingLineOk() ? "kyllä" : "ei"));

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Miksi ajolinjaa ei noudatettu: ");
            newLineAtOffset(contentStream, 0, -lineSpacing);

            var abc = new Abc();
            myList.forEach(line -> {
                methodThatChangesAbc();
                //abc still old abc
            });


            if (report.getDrivingLineInfo() != null && !report.getDrivingLineInfo().isEmpty()) {
                WordUtils.wrap(report.getDrivingLineInfo(), 70).lines().forEach(line -> {
                    try {
                        logger.debug("HELLO: " + line);
                        contentStream.showText(line);
                        newLineAtOffset(contentStream, 0, -lineSpacing);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
            }


            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Ajonopeus on hyväksytty: " + (report.getSpeedLimitOk() ? "kyllä" : "ei"));

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Miksi ajonopeutta ei hyväksytä: ");
            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText((report.getSpeedLimitInfo() == null || report.getSpeedLimitInfo().isEmpty()) ? "-" : report.getSpeedLimitInfo());

            newLineAtOffset(contentStream, 0, -lineSpacing);
            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Poikkeavia havaintoja: " + (report.getAnomalies() ? "kyllä" : "ei"));

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Liikuntasauman rikkoutuminen: " + (report.getJointDamage() ? "kyllä" : "ei"));

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Pysyvä taipuma tai muu siirtymä: " + (report.getBendOrDisplacement() ? "kyllä" : "ei"));

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Jotain muuta, mitä? " + (report.getOtherObservations() ? "kyllä" : "ei"));
            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText((report.getOtherObservationsInfo() == null || report.getOtherObservationsInfo().isEmpty()) ? "" : report.getOtherObservationsInfo());
            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText((report.getAnomaliesDescription() == null || report.getAnomaliesDescription().isEmpty()) ? "" : report.getAnomaliesDescription());

            newLineAtOffset(contentStream, 0, -lineSpacing);
            contentStream.showText("Lisätiedot: " + report.getAdditionalInfo());


            contentStream.endText();
            contentStream.close();


            int imageCount = ((images == null || images.isEmpty()) ? 0 : images.size());

            if (imageCount > 0) {
                PDPage pageTwo = new PDPage();
                document.addPage(pageTwo);
                PDPageContentStream contentStream2 = new PDPageContentStream(document, pageTwo);
                contentStream2.beginText();
                contentStream2.setFont(PDType1Font.COURIER, 12);
                newLineAtOffset(contentStream2, 50, 750);
                contentStream2.showText("Kuvat (" + imageCount + "kpl)");
                newLineAtOffset(contentStream2, 0, -lineSpacing);
                contentStream2.endText();

                handleImages(contentStream2, supervision.getImages(), document);
                contentStream2.close();
            } else {

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

    private void newLineAtOffset(PDPageContentStream contentStream, int tx, float lineSpacing) throws IOException {
        contentStream.newLineAtOffset(tx, lineSpacing);
        y += lineSpacing;
        if (y < 20) {
            newPage(contentStream);
        }
        logger.debug("" + y);
    }

    private void handleImages(PDPageContentStream contentStream, List<SupervisionImageModel> images, PDDocument document) {
        int y = 450;
        for (SupervisionImageModel image : images) {
            String objectKey = image.getObjectKey();
            String decodedKey = new String(Base64.getDecoder().decode(objectKey));
            logger.debug("decodedKey" + decodedKey);
            if (activeProfile.equals("local")) {
                // Get from local file system
                String filename = decodedKey.substring(decodedKey.lastIndexOf("/"));

                File inputFile = new File("/", filename);
                if (inputFile.exists()) {
                    PDImageXObject pdImage = null;
                    try {
                        pdImage = PDImageXObject.createFromFile(inputFile.getPath(), document);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                    final float DESIRED_PHOTO_WIDTH = 150;
                    final float ratio = pdImage.getWidth() / DESIRED_PHOTO_WIDTH;
                    final float newHeight = pdImage.getHeight() / ratio;

                    try {
                        contentStream.drawImage(pdImage, 20, y, DESIRED_PHOTO_WIDTH, newHeight);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    y -= 200;
                    logger.debug("drew");
                } else {
                    logger.debug("file no");
                }
            } else {
                logger.debug("not local");
            }
        }
    }

    private void newPage(PDPageContentStream contentStream) {
        try {
            contentStream.endText();

            PDPage page = new PDPage();
            document.addPage(page);
            contentStream = new PDPageContentStream(document, page);
            contentStream.beginText();
            contentStream.setFont(PDType1Font.COURIER, 12);
            contentStream.showText("HELLO");
        } catch (IOException e) {
            e.printStackTrace();
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
