package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.api.rest.error.LeluPdfUploadException;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import fi.vaylavirasto.sillari.util.PDFGenerator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.util.ArrayList;
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
            // The sending list needs supervision started time, bridge, routeTransport and permit details
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
            supervision.setRouteTransport(routeTransportRepository.getRouteTransportById(supervision.getRouteTransportId()));
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
    public void completeSupervision(Integer supervisionId, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.REPORT_SIGNED, OffsetDateTime.now(), user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
    }

    public void createSupervisionPdf(Integer supervisionId) {
        SupervisionModel supervision = getSupervision(supervisionId);
        supervision.setImages(supervisionImageService.getSupervisionImages(supervision.getId()));

        List<byte[]> images = getImageFiles(supervision.getImages(), activeProfile.equals("local"));
        byte[] pdf = new PDFGenerator().generateReportPDF(supervision, images);

        if (pdf != null) {
            try {
                savePdf(pdf, supervision.getId());
            } catch (LeluPdfUploadException e) {
                // TODO what to do?
                e.printStackTrace();
            }
        }
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

    public byte[] getSupervisionPdf(Long reportId) throws IOException {
        String objectKey = "" + reportId;
        if (activeProfile.equals("local")) {
            // Get from local file system
            String filename = objectKey + ".pdf";

            File inputFile = new File("/", filename);
            if (inputFile.exists()) {
                FileInputStream in = new FileInputStream(inputFile);
                return in.readAllBytes();
            } else {
                logger.error("no file");
            }
        } else {
            // Get from AWS
            return awss3Client.download(objectKey, AWSS3Client.SILLARI_SUPERVISION_PDF_BUCKET);
        }
        return null;
    }

    public void savePdf(byte[] reportPDF, int supervisionId) throws LeluPdfUploadException {
        logger.debug("save pdf: " + supervisionId);
        String objectKey = "" + supervisionId;
        if (activeProfile.equals("local")) {
            // Save to local file system
            File outputFile = new File("/", objectKey + ".pdf");
            try {
                Files.write(outputFile.toPath(), reportPDF);
                logger.debug("wrote pdf local file: " + outputFile.getAbsolutePath() + outputFile.getName());
            } catch (IOException e) {
                logger.error("Error writing file." + e.getClass().getName() + " " + e.getMessage());
                throw new LeluPdfUploadException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            // Upload to AWS
            boolean success = awss3Client.upload(objectKey, reportPDF, "application/pdf", AWSS3Client.SILLARI_SUPERVISION_PDF_BUCKET, AWSS3Client.SILLARI_PERMITS_ROLE_SESSION_NAME);
            logger.debug("Uploaded to AWS: " + objectKey);
            if (!success) {
                throw new LeluPdfUploadException("Error uploading file to aws.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


    public List<byte[]> getImageFiles(List<SupervisionImageModel> imageMetadatas, boolean isLocal) {
        List<byte[]> images = new ArrayList<>();
        for (SupervisionImageModel imageMetadata : imageMetadatas) {


            String objectKey = imageMetadata.getObjectKey();
            String decodedKey = new String(Base64.getDecoder().decode(objectKey));


            String filename = decodedKey.substring(decodedKey.lastIndexOf("/"));
            if (isLocal) {
                // Get from local file system
                File inputFile = new File("/", filename);
                if (inputFile.exists()) {

                    try {
                        byte[] imageBytes = Files.readAllBytes(Path.of(inputFile.getPath()));
                        images.add(imageBytes);
                    } catch (IOException e) {
                        logger.error("Local image creation failed: " + e.getClass().getName() + e.getMessage());
                    }
                } else {
                    logger.debug("No local input file");
                }
            } else {
                //from aws s3
                byte[] imageBytes = awss3Client.download(decodedKey, awss3Client.getPhotoBucketName());
                images.add(imageBytes);
            }

        }

        return images;
    }
}
