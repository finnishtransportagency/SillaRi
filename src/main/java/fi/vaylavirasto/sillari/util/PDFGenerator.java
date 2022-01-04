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

import java.io.*;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;


public class PDFGenerator {
    public static final int TOP_MARGIN = 50;
    private static final Logger logger = LogManager.getLogger();
    private final SupervisionModel supervision;
    private final boolean isLocal;


    private PDDocument document;
    private PDPageContentStream contentStream;

    private float y;
    private static final float LINE_SPACING = 15;
    private PDPage page;


    public PDFGenerator(SupervisionModel supervision, boolean isLocal) {
        this.supervision = supervision;
        this.isLocal = isLocal;
    }

    public byte[] generateReportPDF() {


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

            contentStream.showText("Sillanvalvontaraportti");

            newLine();
            contentStream.setFont(PDType1Font.COURIER, 12);

            newLine();
            contentStream.showText("Lupanumero: " + permit.getPermitNumber());

            newLine();
            contentStream.showText("Reitin nimi: " + route.getName());

            String supervisionTime = "-";
            try {
                supervisionTime = formatStatusDate(supervision, SupervisionStatusType.IN_PROGRESS);
            } catch (Exception e) {
                logger.debug("caugth: " + e.getClass().getName() + e.getMessage());
            }
            newLine();
            contentStream.showText("Valvonta aloitettu: " + supervisionTime);

            newLine();
            contentStream.showText("Silta: " + bridge.getName() + " | " + bridge.getIdentifier() + " | " + bridge.getOid());

            newLine();
            contentStream.showText("Tieosoite: " + (bridge.getRoadAddress() == null ? "-" : bridge.getRoadAddress()));

            String signTime = "-";
            try {
                signTime = formatStatusDate(supervision, SupervisionStatusType.REPORT_SIGNED);
            } catch (Exception e) {
                logger.debug("caugth: " + e.getClass().getName() + e.getMessage());
            }
            newLine();
            contentStream.showText("Kuittauksen ajankohta: " + signTime);

            newLine();
            contentStream.showText("Sillanvalvoja: " + ((supervisor == null) ? "-" : supervisor.getFirstName() + " " + supervisor.getLastName()));

            newLine();
            newLine();
            contentStream.setFont(PDType1Font.COURIER, 14);
            contentStream.showText("Havainnot");
            newLine();

            newLine();
            contentStream.setFont(PDType1Font.COURIER, 12);
            contentStream.showText("Ajolinjaa on noudatettu: " + (report.getDrivingLineOk() ? "kyllä" : "ei"));

            newLine();
            contentStream.showText("Miksi ajolinjaa ei noudatettu: ");
            newLine();

            if (report.getDrivingLineInfo() != null && !report.getDrivingLineInfo().isEmpty()) {
                for(var line: WordUtils.wrap(report.getDrivingLineInfo(), 70).lines().collect(Collectors.toList())){
                    try {
                        logger.debug("HELLO: " + line);
                        contentStream.showText(line);
                        newLine();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                };
            }


            newLine();
            contentStream.showText("Ajonopeus on hyväksytty: " + (report.getSpeedLimitOk() ? "kyllä" : "ei"));

            newLine();
            contentStream.showText("Miksi ajonopeutta ei hyväksytä: ");
            newLine();
            contentStream.showText((report.getSpeedLimitInfo() == null || report.getSpeedLimitInfo().isEmpty()) ? "-" : report.getSpeedLimitInfo());

            newLine();
            newLine();
            contentStream.showText("Poikkeavia havaintoja: " + (report.getAnomalies() ? "kyllä" : "ei"));

            newLine();
            contentStream.showText("Liikuntasauman rikkoutuminen: " + (report.getJointDamage() ? "kyllä" : "ei"));

            newLine();
            contentStream.showText("Pysyvä taipuma tai muu siirtymä: " + (report.getBendOrDisplacement() ? "kyllä" : "ei"));

            newLine();
            contentStream.showText("Jotain muuta, mitä? " + (report.getOtherObservations() ? "kyllä" : "ei"));
            newLine();
            contentStream.showText((report.getOtherObservationsInfo() == null || report.getOtherObservationsInfo().isEmpty()) ? "" : report.getOtherObservationsInfo());
            newLine();
            contentStream.showText((report.getAnomaliesDescription() == null || report.getAnomaliesDescription().isEmpty()) ? "" : report.getAnomaliesDescription());

            newLine();
            contentStream.showText("Lisätiedot: " + report.getAdditionalInfo());


            contentStream.endText();
            contentStream.close();


            int imageCount = ((images == null || images.isEmpty()) ? 0 : images.size());

            if (imageCount > 0) {
                page = new PDPage();
                document.addPage(page);
                contentStream = new PDPageContentStream(document, page);
                contentStream.beginText();
                contentStream.setFont(PDType1Font.COURIER, 12);
                newLine();
                contentStream.showText("Kuvat (" + imageCount + "kpl)");
        newLine();
                contentStream.endText();

                handleImages(contentStream, supervision.getImages(), document);
                contentStream.close();
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

    private void newLine() throws IOException {
        contentStream.newLineAtOffset(0, -LINE_SPACING);
        y -= LINE_SPACING;
        if (y < 20) {
            y = page.getMediaBox().getHeight() - TOP_MARGIN;
            newPage();
        }
        logger.debug("" + y);
    }

    private void newPage() {
        try {
            contentStream.showText("HELLO1");
            contentStream.endText();
            contentStream.close();

            page = new PDPage();
            document.addPage(page);
            contentStream = new PDPageContentStream(document, page);
            contentStream.beginText();
            contentStream.setFont(PDType1Font.COURIER, 12);
            contentStream.newLineAtOffset(50, y);
            contentStream.showText("HELLO");

        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private void handleImages(PDPageContentStream contentStream, List<SupervisionImageModel> images, PDDocument document) {
        int y = 450;
        for (SupervisionImageModel image : images) {
            String objectKey = image.getObjectKey();
            String decodedKey = new String(Base64.getDecoder().decode(objectKey));
            logger.debug("decodedKey" + decodedKey);
            if (isLocal) {
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

                    final float MAX_PHOTO_WIDTH = page.getMediaBox().getWidth() - 40;
                    final float MAX_PHOTO_HEIGHT = page.getMediaBox().getHeight() - 40;

                    float newWidth= pdImage.getWidth();
                    float newHeight = pdImage.getHeight();

                    if(pdImage.getWidth() > MAX_PHOTO_WIDTH){
                        final float ratio = pdImage.getWidth() / MAX_PHOTO_WIDTH;
                        newWidth = MAX_PHOTO_WIDTH;
                        newHeight = pdImage.getHeight() / ratio;
                    }

                    if(newHeight > MAX_PHOTO_HEIGHT){
                        final float ratio = pdImage.getHeight() / MAX_PHOTO_HEIGHT;
                        newWidth = newWidth / ratio;
                        newHeight = MAX_PHOTO_HEIGHT;
                    }


                    try {
                        contentStream.drawImage(pdImage, 20, y, newWidth, newHeight);
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



    @NotNull
    private String formatStatusDate(SupervisionModel supervision, SupervisionStatusType supervisionStatusType) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        return supervision.getStatusHistory().stream()
                .filter(supervisionStatusModel -> supervisionStatusModel.getStatus().equals(supervisionStatusType))
                .findFirst().orElseThrow().getTime().format(formatter);
    }


}
