package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;

@Service
public class SupervisionService {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;
    @Autowired
    SupervisionReportRepository supervisionReportRepository;
    @Autowired
    SupervisorRepository supervisorRepository;
    @Autowired
    SupervisionImageRepository supervisionImageRepository;
    @Autowired
    RouteTransportRepository routeTransportRepository;
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    PermitRepository permitRepository;
    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    SupervisionImageService supervisionImageService;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;


    public SupervisionModel getSupervision(Integer supervisionId) {
        SupervisionModel supervision = supervisionRepository.getSupervisionById(supervisionId);
        if (supervision != null) {
            fillSupervisionDetails(supervision);
            fillPermitDetails(supervision);
        }
        return supervision;
    }

    private void fillSupervisionDetails(SupervisionModel supervision) {
        Integer supervisionId = supervision.getId();
        supervision.setReport(supervisionReportRepository.getSupervisionReport(supervisionId));
        supervision.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervisionId));
        supervision.setImages(supervisionImageRepository.getFiles(supervisionId));
        // Sets also current status and status timestamps
        supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervisionId));
    }

    private void fillPermitDetails(SupervisionModel supervision) {
        RouteBridgeModel routeBridge = supervision.getRouteBridge();
        if (routeBridge != null) {
            RouteModel route = routeRepository.getRoute(supervision.getRouteBridge().getRouteId());
            routeBridge.setRoute(route);
            if (route != null) {
                route.setPermit(permitRepository.getPermit(route.getPermitId()));
            }
        }
    }

    public List<SupervisionModel> getSupervisionsOfSupervisor(String username) {
        List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsBySupervisorUsername(username);
        for (SupervisionModel supervision : supervisions) {
            // Sets also current status and status timestamps
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
            supervision.setRouteTransport(routeTransportRepository.getRouteTransportById(supervision.getRouteTransportId()));
        }
        return supervisions;
    }

    public List<SupervisionModel> getFinishedButUnsignedSupervisions(String username) {
        List<SupervisionModel> supervisions = supervisionRepository.getFinishedButUnsignedSupervisionsBySupervisorUsername(username);
        for (SupervisionModel supervision : supervisions) {
            // The sending list needs supervision started time, bridge and permit details
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
            fillPermitDetails(supervision);
        }
        return supervisions;
    }

    public List<SupervisorModel> getSupervisors() {
        // TODO - limit the list of supervisors somehow?
        return supervisorRepository.getSupervisors();
    }

    // Creates new supervision and adds a new status with type PLANNED
    // The timestamp in PLANNED is the current time, not planned_time which can be updated later.
    public void createSupervision(SupervisionModel supervisionModel, SillariUser user) {
        Integer supervisionId = supervisionRepository.createSupervision(supervisionModel);
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.PLANNED, OffsetDateTime.now(), user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
    }

    // Updates supervision fields (supervisors, planned time)
    public void updateSupervision(SupervisionModel supervisionModel) {
        supervisionRepository.updateSupervision(supervisionModel);
    }

    public SupervisionModel updateConformsToPermit(SupervisionModel supervision) {
        supervisionRepository.updateSupervision(supervision.getId(), supervision.getConformsToPermit());
        return getSupervision(supervision.getId());
    }

    public void deleteSupervision(SupervisionModel supervisionModel) {
        supervisionRepository.deleteSupervision(supervisionModel);
    }

    // Adds the status IN_PROGRESS and creates a new supervision report
    public SupervisionModel startSupervision(SupervisionReportModel report, SillariUser user) {
        Integer supervisionId = report.getSupervisionId();
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.IN_PROGRESS, OffsetDateTime.now(), user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);

        supervisionReportRepository.createSupervisionReport(report);
        return getSupervision(supervisionId);
    }

    // Ends the supervision by adding the status CROSSING_DENIED
    public SupervisionModel denyCrossing(Integer supervisionId, String denyReason, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.CROSSING_DENIED, OffsetDateTime.now(), denyReason, user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
        return getSupervision(supervisionId);
    }

    // Ends the supervision by adding the status FINISHED
    public SupervisionModel finishSupervision(Integer supervisionId, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.FINISHED, OffsetDateTime.now(), user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
        return getSupervision(supervisionId);
    }

    // Completes the supervision by adding the status REPORT_SIGNED
    public SupervisionModel completeSupervision(Integer supervisionId, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.REPORT_SIGNED, OffsetDateTime.now(), user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
        try {
            SupervisionModel supervision = getSupervision(supervisionId);
            byte[] pdf = generateReportPDF(supervision);
            String objectKey = "" + supervisionId;
            boolean success = awss3Client.upload(objectKey, pdf, "application/pdf", AWSS3Client.SILLARI_PERMIT_PDF_BUCKET, AWSS3Client.SILLARI_PERMITS_ROLE_SESSION_NAME);
            if (!success) {
                // throw new LeluPermitPdfUploadException("Error uploading file to aws.", HttpStatus.INTERNAL_SERVER_ERROR);
                logger.error("Error uploading file to aws.");
            }
        } catch (Exception e) {
            logger.error("Error uploading file to aws." + e.getClass().getName() + " " + e.getMessage());
            // throw new LeluPermitPdfUploadException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return getSupervision(supervisionId);
    }

    public byte[] generateReportPDF(SupervisionModel supervision) {

        BridgeModel bridge = supervision.getRouteBridge().getBridge();
        RouteModel route = supervision.getRouteBridge().getRoute();
        SupervisionReportModel report = supervision.getReport();
        PermitModel permit = route.getPermit();
        SupervisorModel supervisor = ((supervision.getSupervisors() == null || supervision.getSupervisors().isEmpty()) ? null : supervision.getSupervisors().get(0));
        var images = supervisionImageService.getSupervisionImages(supervision.getId());

        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);

        try {
            PDPageContentStream contentStream = new PDPageContentStream(document, page);

            contentStream.beginText();
            contentStream.setFont(PDType1Font.COURIER, 16);


            contentStream.setLeading(12 * 1.2f);
            contentStream.newLineAtOffset(50, 750);

            contentStream.showText("Sillanvalvontaraportti");
            contentStream.newLine();
            contentStream.setFont(PDType1Font.COURIER, 12);

            contentStream.newLine();
            contentStream.showText("Lupanumero: " + permit.getPermitNumber());

            contentStream.newLine();
            contentStream.showText("Reitin nimi: " + route.getName());

            String supervisionTime = "-";
            try {
                supervisionTime = formatStatusDate(supervision, SupervisionStatusType.IN_PROGRESS);
            } catch (Exception e) {
                logger.debug("caugth: " + e.getClass().getName() + e.getMessage());
            }
            contentStream.newLine();
            contentStream.showText("Valvonta aloitettu: " + supervisionTime);

            contentStream.newLine();
            contentStream.showText("Silta: " + bridge.getName() + " | " + bridge.getIdentifier() + " | " + bridge.getOid());

            contentStream.newLine();
            contentStream.showText("Tieosoite: " + (bridge.getRoadAddress() == null ? "-" : bridge.getRoadAddress()));

            String signTime = "-";
            try {
                signTime = formatStatusDate(supervision, SupervisionStatusType.REPORT_SIGNED);
            } catch (Exception e) {
                logger.debug("caugth: " + e.getClass().getName() + e.getMessage());
            }
            contentStream.newLine();
            contentStream.showText("Kuittauksen ajankohta: " + signTime);

            contentStream.newLine();
            contentStream.showText("Sillanvalvoja: " + ((supervisor == null) ? "-" : supervisor.getFirstName() + " " + supervisor.getLastName()));

            contentStream.newLine();
            contentStream.newLine();
            contentStream.setFont(PDType1Font.COURIER, 14);
            contentStream.showText("Havainnot");
            contentStream.newLine();

            contentStream.newLine();
            contentStream.setFont(PDType1Font.COURIER, 12);
            contentStream.showText("Ajolinjaa on noudatettu: " + (report.getDrivingLineOk() ? "kyllä" : "ei"));

            contentStream.newLine();
            contentStream.showText("Miksi ajolinjaa ei noudatettu: " + report.getDrivingLineInfo());
            contentStream.newLine();
            contentStream.showText((report.getDrivingLineInfo() == null || report.getDrivingLineInfo().isEmpty()) ? "-" : report.getDrivingLineInfo());
            contentStream.newLine();

            contentStream.newLine();
            contentStream.showText("Ajonopeus on hyväksytty: " + (report.getSpeedLimitOk() ? "kyllä" : "ei"));

            contentStream.newLine();
            contentStream.showText("Miksi ajonopeutta ei hyväksytä: ");
            contentStream.newLine();
            contentStream.showText((report.getSpeedLimitInfo() == null || report.getSpeedLimitInfo().isEmpty()) ? "-" : report.getSpeedLimitInfo());

            contentStream.newLine();
            contentStream.newLine();
            contentStream.showText("Poikkeavia havaintoja: " + (report.getAnomalies() ? "kyllä" : "ei"));

            contentStream.newLine();
            contentStream.showText("Liikuntasauman rikkoutuminen: " + (report.getJointDamage() ? "kyllä" : "ei"));

            contentStream.newLine();
            contentStream.showText("Pysyvä taipuma tai muu siirtymä: " + (report.getBendOrDisplacement() ? "kyllä" : "ei"));

            contentStream.newLine();
            contentStream.showText("Jotain muuta, mitä? " + (report.getOtherObservations() ? "kyllä" : "ei"));
            contentStream.newLine();
            contentStream.showText((report.getOtherObservationsInfo() == null || report.getOtherObservationsInfo().isEmpty()) ? "" : report.getOtherObservationsInfo());
            contentStream.newLine();
            contentStream.showText((report.getAnomaliesDescription() == null || report.getAnomaliesDescription().isEmpty()) ? "" : report.getAnomaliesDescription());

            contentStream.newLine();
            contentStream.showText("Lisätiedot: " + report.getAdditionalInfo());
            contentStream.endText();
            contentStream.close();



            int imageCount = ((images == null || images.isEmpty()) ? 0 : images.size());

            if (imageCount > 0) {
                PDPage pageTwo = new PDPage();
                document.addPage(pageTwo);
                contentStream = new PDPageContentStream(document, pageTwo);
                contentStream.beginText();
                contentStream.setFont(PDType1Font.COURIER, 12);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("Kuvat (" + imageCount + "kpl)");
                contentStream.newLine();
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

    @NotNull
    private String formatStatusDate(SupervisionModel supervision, SupervisionStatusType supervisionStatusType) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        return supervision.getStatusHistory().stream()
                .filter(supervisionStatusModel -> supervisionStatusModel.getStatus().equals(supervisionStatusType))
                .findFirst().orElseThrow().getTime().format(formatter);
    }

    // Deletes the report and adds the status CANCELLED
    public SupervisionModel cancelSupervision(Integer supervisionId, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.CANCELLED, OffsetDateTime.now(), user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);

        supervisionReportRepository.deleteSupervisionReport(supervisionId);
        return getSupervision(supervisionId);
    }

    // Updates the report fields
    public SupervisionModel updateSupervisionReport(SupervisionReportModel supervisionReportModel) {
        supervisionReportRepository.updateSupervisionReport(supervisionReportModel);
        return getSupervision(supervisionReportModel.getSupervisionId());
    }

}
