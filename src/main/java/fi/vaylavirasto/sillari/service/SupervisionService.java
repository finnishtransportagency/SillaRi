package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.api.rest.error.PDFDownloadException;
import fi.vaylavirasto.sillari.api.rest.error.PDFGenerationException;
import fi.vaylavirasto.sillari.api.rest.error.PDFUploadException;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import fi.vaylavirasto.sillari.util.PDFGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.util.*;

@Slf4j
@Service
public class SupervisionService {
    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    S3FileService s3FileService;
    @Autowired
    BridgeService bridgeService;
    @Autowired
    SupervisionPdfService pdfService;


    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;
    @Autowired
    SupervisionReportRepository supervisionReportRepository;
    @Autowired
    SupervisionImageRepository supervisionImageRepository;
    @Autowired
    RouteTransportRepository routeTransportRepository;
    @Autowired
    RouteTransportStatusRepository routeTransportStatusRepository;
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    RouteBridgeRepository routeBridgeRepository;
    @Autowired
    PermitRepository permitRepository;
    @Autowired
    CompanyRepository companyRepository;


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
        supervision.setImages(supervisionImageRepository.getSupervisionImages(supervisionId));
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

    private void fillTransportDetails(SupervisionModel supervision) {
        RouteTransportModel routeTransport = routeTransportRepository.getRouteTransportById(supervision.getRouteTransportId());
        if (routeTransport != null) {
            // Sets also current status
            routeTransport.setStatusHistory(routeTransportStatusRepository.getTransportStatusHistory(routeTransport.getId()));
        }
        supervision.setRouteTransport(routeTransport);
    }

    public List<SupervisionModel> getSupervisionsOfSupervisor(SillariUser user) {
        List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsBySupervisor(user.getBusinessId());
        for (SupervisionModel supervision : supervisions) {
            // Sets also current status and status timestamps
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
            supervision.setRouteTransport(routeTransportRepository.getRouteTransportById(supervision.getRouteTransportId()));
        }
        return supervisions;
    }

    public List<SupervisionModel> getSupervisionsOfAreaContractorSupervisor(SillariUser user) {
        List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsOfAreaContractor(user.getBusinessId());
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


    public List<SupervisionModel> getFinishedButUnsignedSupervisionsNoDetails(SillariUser user) {
        return supervisionRepository.getFinishedButUnsignedSupervisionsBySupervisor(user.getBusinessId());
    }

    public List<SupervisionModel> getUnsignedSupervisionsOfSupervisorNoDetails(SillariUser user) {
        return supervisionRepository.getUnsignedSupervisionsBySupervisor(user.getBusinessId());
    }

    public List<SupervisionModel> getAllSupervisionsOfSupervisorNoDetails(SillariUser user) {
        return supervisionRepository.getAllSupervisionsOfSupervisor(user.getBusinessId());
    }


    public List<SupervisionModel> getFinishedSupervisions(SillariUser user) {
        List<SupervisionModel> supervisions = supervisionRepository.getFinishedSupervisionsBySupervisor(user.getBusinessId());
        for (SupervisionModel supervision : supervisions) {
            // The sending list needs supervision started time, bridge, routeTransport and permit details
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
            supervision.setRouteTransport(routeTransportRepository.getRouteTransportById(supervision.getRouteTransportId()));
            fillPermitDetails(supervision);
        }
        return supervisions;
    }


    // Creates new supervision and adds a new status
    // The timestamp in PLANNED is the current time, not planned_time which can be updated later.
    public Integer createSupervision(SupervisionModel supervisionModel, String username, SupervisionStatusType supervisionStatusType) {
        Integer supervisionId = supervisionRepository.createSupervision(supervisionModel);
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, supervisionStatusType, OffsetDateTime.now(), username);
        supervisionStatusRepository.insertSupervisionStatus(status);
        return supervisionId;
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
    public SupervisionModel startSupervision(SupervisionReportModel report, OffsetDateTime startTime, SillariUser user) {
        Integer supervisionId = report.getSupervisionId();
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.IN_PROGRESS, startTime, user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);

        supervisionReportRepository.createSupervisionReport(report);
        return getSupervision(supervisionId, true, true);
    }

    // Ends the supervision by adding the status CROSSING_DENIED
    public SupervisionModel denyCrossing(Integer supervisionId, String denyReason, OffsetDateTime denyTime, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.CROSSING_DENIED, denyTime, denyReason, user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
        return getSupervision(supervisionId, true, false);
    }

    // Ends the supervision by adding the status FINISHED
    public SupervisionModel finishSupervision(Integer supervisionId, OffsetDateTime finishTime, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.FINISHED, finishTime, user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
        return getSupervision(supervisionId, true, true);
    }

    // Completes the supervision by adding the status REPORT_SIGNED
    public SupervisionModel completeSupervision(Integer supervisionId, OffsetDateTime completeTime, SillariUser user, boolean fillDetailsAndReturn) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.REPORT_SIGNED, completeTime, user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
        if(fillDetailsAndReturn){
            return getSupervision(supervisionId, true, true);
        }else{
            return null;
        }
    }

    public void createSupervisionPdf(Integer supervisionId) {
        SupervisionModel supervision = getSupervision(supervisionId, true, false);

        if (supervision != null && supervision.getReport() != null) {
            // Update pdf details to DB and set pdf status to IN_PROGRESS
            SupervisionPdfModel pdfModel = pdfService.createSupervisionPdf(new SupervisionPdfModel(supervisionId, "supervision_" + supervisionId + ".pdf"));
            List<byte[]> images = getImageFiles(supervision.getImages(), activeProfile.equals("local"));

            byte[] pdf = new byte[0];
            try {
                pdf = new PDFGenerator().generateReportPDF(supervision, images);

                log.debug("Generated pdf report for supervision: " + supervisionId);

                savePdf(pdf, pdfModel);
                pdfModel.setStatus(SupervisionPdfStatusType.SUCCESS);
                pdfService.updateSupervisionPdfStatus(pdfModel);
                log.debug("Saved pdf report for supervision: " + supervisionId);
            } catch (PDFGenerationException e) {
                log.warn("Generating pdf report for supervision failed. " + supervisionId + " " + e.getMessage());
                pdfModel.setStatus(SupervisionPdfStatusType.FAILED);
                pdfService.updateSupervisionPdfStatus(pdfModel);
            } catch (PDFUploadException e) {
                log.warn("Saving pdf report for supervision failed. " + supervisionId + " " + e.getMessage());
                pdfModel.setStatus(SupervisionPdfStatusType.FAILED);
                pdfService.updateSupervisionPdfStatus(pdfModel);
            }

        } else {
            log.error("supervision or report null, cannot create pdf for supervision={}", supervisionId);
        }
    }


    // Deletes the report and adds the status CANCELLED
    public SupervisionModel cancelSupervision(Integer supervisionId, OffsetDateTime cancelTime, SillariUser user) {
        SupervisionStatusModel status = new SupervisionStatusModel(supervisionId, SupervisionStatusType.CANCELLED, cancelTime, user.getUsername());
        supervisionStatusRepository.insertSupervisionStatus(status);
        supervisionReportRepository.deleteSupervisionReport(supervisionId);

        // Delete supervision images from DB and AWS S3 bucket (or local file system in local environment)
        // Deleting pdf files is not necessary, since cancelSupervision is not allowed when supervision report is ready.
        List<SupervisionImageModel> images = supervisionImageRepository.getSupervisionImages(supervisionId);

        for (SupervisionImageModel image : images) {
            String decodedKey = new String(Base64.getDecoder().decode(image.getObjectKey()));
            s3FileService.deleteFile(awss3Client.getPhotoBucketName(), decodedKey, image.getFilename());
        }

        supervisionImageRepository.deleteSupervisionImages(supervisionId);

        return getSupervision(supervisionId, true, true);
    }

    // Updates the report fields
    public SupervisionModel updateSupervisionReport(SupervisionReportModel supervisionReportModel) {
        supervisionReportRepository.updateSupervisionReport(supervisionReportModel);
        return getSupervision(supervisionReportModel.getSupervisionId(), true, true);
    }

    public void getSupervisionPdf(HttpServletResponse response, Integer supervisionId) throws IOException, PDFDownloadException {
        SupervisionPdfModel pdfModel = pdfService.getSupervisionPdfBySupervisionId(supervisionId);

        if (pdfModel != null) {
            SupervisionPdfStatusType pdfStatus = pdfModel.getStatus();

            if (pdfStatus.equals(SupervisionPdfStatusType.IN_PROGRESS)) {
                throw new PDFDownloadException("PDF still in progress", HttpStatus.NOT_FOUND);
            } else if (pdfStatus.equals(SupervisionPdfStatusType.FAILED)) {
                throw new PDFDownloadException("PDF generation failed, no file available", HttpStatus.NOT_FOUND);
            } else if (pdfStatus.equals(SupervisionPdfStatusType.SUCCESS)) {
                s3FileService.getFile(response, awss3Client.getReportBucketName(), pdfModel.getObjectKey(), pdfModel.getFilename(), "application/pdf");
            }
        }
    }


    public void savePdf(byte[] reportPDF, SupervisionPdfModel pdfModel) throws PDFUploadException {
        log.debug("save pdf for supervision: " + pdfModel.getSupervisionId());

        try {
            boolean success = s3FileService.saveFile(reportPDF, "application/pdf", awss3Client.getReportBucketName(), pdfModel.getObjectKey(), pdfModel.getKtvObjectId(), pdfModel.getFilename(), pdfModel.getRowCreatedTime(), pdfModel.getSupervisionId());
            if (!success) {
                throw new PDFUploadException("Error uploading file to AWS.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IOException e) {
            log.error("Error writing file to local file system." + e.getClass().getName() + " " + e.getMessage());
            throw new PDFUploadException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    public List<byte[]> getImageFiles(List<SupervisionImageModel> imageModels, boolean isLocal) {
        List<byte[]> images = new ArrayList<>();
        for (SupervisionImageModel imageModel : imageModels) {

            String objectKey = imageModel.getObjectKey();
            String decodedKey = new String(Base64.getDecoder().decode(objectKey));
            String filename = imageModel.getFilename();

            if (isLocal) {
                // Get from local file system
                File inputFile = new File("/", filename);
                if (inputFile.exists()) {

                    try {
                        byte[] imageBytes = Files.readAllBytes(Path.of(inputFile.getPath()));
                        images.add(imageBytes);
                    } catch (IOException e) {
                        log.error("Local image creation failed: " + e.getClass().getName() + e.getMessage());
                    }
                } else {
                    log.debug("No local input file");
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
                            log.debug("No local input file");
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

    public List<String> getSupervisorsByRouteBridgeId(Integer routeBridgeId) {
        return supervisionRepository.getSupervisorsByRouteBridgeId(routeBridgeId);
    }

    public List<String> getSupervisorsByRouteId(Integer routeId) {
        return supervisionRepository.getSupervisorsByRouteId(routeId);
    }

    public List<String> getSupervisorsByRouteTransportId(Integer routeTransportId) {
        return supervisionRepository.getSupervisorsByRouteTransportId(routeTransportId);
    }

    public List<String> getSupervisorsByPermitId(Integer permitId) {
        return supervisionRepository.getSupervisorsByPermitId(permitId);
    }

    public CompanyModel getCompanyOfSupervision(SupervisionModel supervision) {
        return companyRepository.getCompanyByRouteBridgeId(supervision.getRouteBridgeId());
    }


    /*Created OWN_LIST_PLANNED -status supervision for permits with customerUsesSillari = false
     * These are visible on area contractor UI.
     * OWN_LIST_PLANNED -supervision are not connected to route transports.
     */

    public Integer createAreaContractorOwnListPlannedSupervision(Integer routeBridgeTemplateId, String contractBusinessId) {
        SupervisionModel supervision = new SupervisionModel();
        supervision.setRouteBridgeId(routeBridgeTemplateId);
        supervision.setConformsToPermit(false);
        supervision.setSupervisorCompany(contractBusinessId);
        supervision.setSupervisorType(SupervisorType.AREA_CONTRACTOR);
        return createSupervision(supervision, "SILLARI_SYSTEM", SupervisionStatusType.OWN_LIST_PLANNED);
    }

    /*
     This is used for area contractor supervisions (permit.customerUsesSillari = false).
     Those supervisions are without "real" route transport up to this point; because transport number handling happens here.
     a) supervision is linked to the right routeBridge, choosing the routeBridge with the lowest available transportNumber
     b) if all the routeBridges obtained from Lelu with different transportNumbers have been used, a new one is created and added to which transportNumber = max(transportNumber) + 1,
         for these routeBridges, a new boolean field MAX_TRANSPORTS_EXCEEDED = true is set.*/
    public void attachSupervisionToTransportNumberedRouteBridge(Integer supervisionId) {
        SupervisionModel supervision = getSupervision(supervisionId, true, false);
        RouteBridgeModel templateRouteBridge = supervision.getRouteBridge();
        templateRouteBridge.getBridge().getIdentifier();
        templateRouteBridge.getRouteId();

        //Only the template routebridge and those added earlier here have supervisions, so we can filter them out
        List<RouteBridgeModel> availableRouteBridges = routeBridgeRepository.getRouteBridgesWithNoSupervisions(templateRouteBridge.getRouteId(),templateRouteBridge.getBridge().getIdentifier());
        Optional<RouteBridgeModel> selectedRouteBridge = availableRouteBridges.stream().min(Comparator.comparing(RouteBridgeModel::getTransportNumber));

        if(selectedRouteBridge.isPresent()){
            //supervision.setRouteBridge(selectedRouteBridge.get());
            supervisionRepository.updateSupervisionsRouteBridge(supervision.getId(), selectedRouteBridge.get().getId());
        }else{
           /* if all the routeBridges obtained from Lelu with different transportNumbers have been used, a new one is created and added to which transportNumber = max(transportNumber) + 1,
         for these routeBridges, a new boolean field MAX_TRANSPORTS_EXCEEDED = true is set */
            RouteBridgeModel extraRouteBridge = new RouteBridgeModel(templateRouteBridge, null);
            extraRouteBridge.setMaxTransportsExceeded(true);
            //supervision.setRouteBridge(extraRouteBridge);
            Integer extraRouteBridgeId = routeBridgeRepository.insertExtraRouteBridge(extraRouteBridge);
            supervisionRepository.updateSupervisionsRouteBridge(supervision.getId(), extraRouteBridgeId);
        }



    }
}