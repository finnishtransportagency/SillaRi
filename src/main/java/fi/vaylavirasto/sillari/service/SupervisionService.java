package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.api.rest.error.LeluPdfUploadException;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.aws.ObjectKeyGenerator;
import fi.vaylavirasto.sillari.dto.CoordinatesDTO;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import fi.vaylavirasto.sillari.service.fim.FIMService;
import fi.vaylavirasto.sillari.util.PDFGenerator;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class SupervisionService {
    private static final Logger logger = LogManager.getLogger();
    private static final String PDF_KTV_PREFIX = "pdf";

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
    RouteTransportStatusRepository routeTransportStatusRepository;
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    PermitRepository permitRepository;
    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    FIMService fimService;
    @Autowired
    BridgeService bridgeService;


    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;


    public SupervisionModel getSupervision(Integer supervisionId) {
        return getSupervision(supervisionId, false, false);
    }

    public SupervisionModel getSupervision(Integer supervisionId, boolean fillDetails, boolean includeImageBase64) {
        SupervisionModel supervision = supervisionRepository.getSupervisionById(supervisionId);
        if (supervision != null && fillDetails) {
            fillSupervisionDetails(supervision);
            fillPermitDetails(supervision);
            fillTransportDetails(supervision);

            if (includeImageBase64) {
                // Populate the base64 image data for use in the UI when offline
                fillImageBase64(supervision);
            }
        }
        return supervision;
    }

    private void fillSupervisionDetails(SupervisionModel supervision) {
        Integer supervisionId = supervision.getId();
        supervision.setReport(supervisionReportRepository.getSupervisionReport(supervisionId));
        supervision.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervisionId));
        fimService.populateSupervisorNamesFromFIM(supervision.getSupervisors());
        supervision.setImages(supervisionImageRepository.getFiles(supervisionId));
        // Sets also current status and status timestamps
        supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervisionId));
    }

    private void setIdsFromDb(List<SupervisorModel> supervisorsFromDbInBoth, List<SupervisorModel> supervisorsFromFIM) {
        for (SupervisorModel supervisorFromDb : supervisorsFromDbInBoth) {
            SupervisorModel supervisorFromFIM = supervisorsFromFIM.stream().filter(s -> s.getUsername().equals(supervisorFromDb.getUsername())).findFirst().orElseThrow();
            supervisorFromFIM.setId(supervisorFromDb.getId());
        }
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

    private void fillTransportDetails(SupervisionModel supervision) {
        RouteTransportModel routeTransport = routeTransportRepository.getRouteTransportById(supervision.getRouteTransportId());
        if (routeTransport != null) {
            // Sets also current status
            routeTransport.setStatusHistory(routeTransportStatusRepository.getTransportStatusHistory(routeTransport.getId()));
        }
        supervision.setRouteTransport(routeTransport);
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

    public SupervisionModel getSupervisionBySupervisionImageId(Integer imageId) {
        return supervisionRepository.getSupervisionBySupervisionImageId(imageId);
    }


    public List<SupervisionModel> getFinishedButUnsignedSupervisionsNoDetails(String username) {
        return supervisionRepository.getFinishedButUnsignedSupervisionsBySupervisorUsername(username);
    }

    public List<SupervisionModel> getUnsignedSupervisionsOfSupervisorNoDetails(String username) {
        return supervisionRepository.getUnsignedSupervisionsBySupervisorUsername(username);
    }

    public List<SupervisionModel> getAllSupervisionsOfSupervisorNoDetails(String username) {
        return supervisionRepository.getAllSupervisionsOfSupervisor(username);
    }


    public List<SupervisionModel> getFinishedSupervisions(String username) {
        List<SupervisionModel> supervisions = supervisionRepository.getFinishedSupervisionsBySupervisorUsername(username);
        for (SupervisionModel supervision : supervisions) {
            // The sending list needs supervision started time, bridge, routeTransport and permit details
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
            supervision.setRouteTransport(routeTransportRepository.getRouteTransportById(supervision.getRouteTransportId()));
            fillPermitDetails(supervision);
        }
        return supervisions;
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
        return getSupervision(supervision.getId(), true, true);
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
        return getSupervision(supervisionId, true, true);
    }

    // Ends the supervision by adding the status CROSSING_DENIED
    public SupervisionModel denyCrossing(Integer supervisionId, String denyReason, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.CROSSING_DENIED, OffsetDateTime.now(), denyReason, user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
        return getSupervision(supervisionId, true, false);
    }

    // Ends the supervision by adding the status FINISHED
    public SupervisionModel finishSupervision(Integer supervisionId, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.FINISHED, OffsetDateTime.now(), user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
        return getSupervision(supervisionId, true, true);
    }

    // Completes the supervision by adding the status REPORT_SIGNED
    public void completeSupervision(Integer supervisionId, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.REPORT_SIGNED, OffsetDateTime.now(), user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
    }

    public void createSupervisionPdf(Integer supervisionId) {
        SupervisionModel supervision = getSupervision(supervisionId, true, false);

        if (supervision != null && supervision.getReport() != null) {
            supervision.setImages(supervisionImageRepository.getFiles(supervisionId));
            List<byte[]> images = getImageFiles(supervision.getImages(), activeProfile.equals("local"));

            byte[] pdf = new PDFGenerator().generateReportPDF(supervision, images);

            if (pdf != null) {
                try {
                    savePdf(pdf, supervision.getId(), supervision.getReport().getId(), supervision.getRouteBridge().getBridge());
                } catch (LeluPdfUploadException e) {
                    // TODO what to do?
                    e.printStackTrace();
                }
            }
        }
    }


    // Deletes the report and adds the status CANCELLED
    public SupervisionModel cancelSupervision(Integer supervisionId, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.CANCELLED, OffsetDateTime.now(), user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);

        supervisionReportRepository.deleteSupervisionReport(supervisionId);
        return getSupervision(supervisionId, true, true);
    }

    // Updates the report fields
    public SupervisionModel updateSupervisionReport(SupervisionReportModel supervisionReportModel) {
        supervisionReportRepository.updateSupervisionReport(supervisionReportModel);
        return getSupervision(supervisionReportModel.getSupervisionId(), true, true);
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
            return awss3Client.download(objectKey, awss3Client.getSupervisionBucketName());
        }
        return null;
    }


    public void savePdf(byte[] reportPDF, int supervisionId, Integer reportId, BridgeModel bridge) throws LeluPdfUploadException {
        logger.debug("save pdf: " + supervisionId);

        String objectIdentifier = ObjectKeyGenerator.generateObjectIdentifier(PDF_KTV_PREFIX, reportId);
        String objectKey = ObjectKeyGenerator.generateObjectKey(objectIdentifier, supervisionId);

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


            CoordinatesDTO coords = bridgeService.getBridgeCoordinates(bridge.getId());
            bridge.setCoordinates(coords);

            // Upload to AWS
            boolean success = awss3Client.upload(objectKey, objectIdentifier, reportPDF, "application/pdf", awss3Client.getSupervisionBucketName(), AWSS3Client.SILLARI_PERMITS_ROLE_SESSION_NAME, bridge);
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

    private void fillImageBase64(SupervisionModel supervision) {
        if (supervision.getImages() != null) {
            supervision.getImages().forEach(supervisionImageModel -> {
                // Determine the content type from the file extension, which could be jpg, jpeg, png or gif
                String filename = supervisionImageModel.getFilename();
                String extension = filename.substring(filename.lastIndexOf(".") + 1);
                String contentType = extension.equals("jpg") ? "image/jpeg" : "image/" + extension;

                if (activeProfile.equals("local")) {
                    // Get from local file system
                    File inputFile = new File("/", filename);
                    if (inputFile.exists()) {
                        try {
                            FileInputStream in = new FileInputStream(inputFile);
                            byte[] imageBytes = in.readAllBytes();
                            in.close();
                            String encodedString = org.apache.tomcat.util.codec.binary.Base64.encodeBase64String(imageBytes);
                            supervisionImageModel.setBase64("data:" + contentType + ";base64," + encodedString);
                        } catch (IOException e) {
                            logger.debug("No local input file");
                        }
                    }
                } else {
                    // Get from AWS
                    String objectKey = new String(Base64.getDecoder().decode(supervisionImageModel.getObjectKey()));
                    byte[] image = awss3Client.download(objectKey, awss3Client.getPhotoBucketName());
                    if (image != null) {
                        ByteArrayInputStream in = new ByteArrayInputStream(image);
                        byte[] imageBytes = in.readAllBytes();
                        String encodedString = org.apache.tomcat.util.codec.binary.Base64.encodeBase64String(imageBytes);
                        supervisionImageModel.setBase64("data:\" + contentType + \";base64," + encodedString);
                    }
                }
            });
        }
    }

    public List<SupervisorModel> getSupervisorsByRouteBridgeId(Integer routeBridgeId) {
        return supervisorRepository.getSupervisorsByRouteBridgeId(routeBridgeId);
    }

    public List<SupervisorModel> getSupervisorsByRouteId(Integer routeId) {
        return supervisorRepository.getSupervisorsByRouteId(routeId);
    }

    public List<SupervisorModel> getSupervisorsByRouteTransportId(Integer routeBridgeId) {
        return supervisorRepository.getSupervisorsByRouteTransportId(routeBridgeId);
    }

    public List<SupervisorModel> getSupervisorsByPermitId(Integer routeId) {
        return supervisorRepository.getSupervisorsByPermitId(routeId);
    }


}
