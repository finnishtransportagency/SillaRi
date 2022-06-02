package fi.vaylavirasto.sillari.service;

import com.amazonaws.util.IOUtils;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.dto.CoordinatesDTO;
import fi.vaylavirasto.sillari.dto.SupervisionMetadataDTO;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.time.OffsetDateTime;

@Service
public class S3FileService {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    SupervisionReportRepository supervisionReportRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;
    @Autowired
    BridgeRepository bridgeRepository;
    @Autowired
    PermitRepository permitRepository;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    public void getFile(HttpServletResponse response, String bucketName, String objectKey, String filename, String contentType) throws IOException {
        if (activeProfile.equals("local")) {
            // Get from local file system
            File inputFile = new File("/", filename);
            if (inputFile.exists()) {
                response.setContentType(contentType);
                OutputStream out = response.getOutputStream();
                FileInputStream in = new FileInputStream(inputFile);
                IOUtils.copy(in, out);
                out.close();
                in.close();
            }
        } else {
            // Get from AWS
            byte[] file = awss3Client.download(objectKey, bucketName);
            if (file != null) {
                response.setContentType(contentType);
                OutputStream out = response.getOutputStream();
                ByteArrayInputStream in = new ByteArrayInputStream(file);
                IOUtils.copy(in, out);
                out.close();
                in.close();
            }
        }
    }

    public boolean saveFile(byte[] decodedString, String contentType, String bucketName, String objectKey, String objectIdentifier, String filename, OffsetDateTime fileCreated, Integer supervisionId) throws IOException {
        if (activeProfile.equals("local")) {
            // Save to local file system
            File outputFile = new File("/", filename);
            Files.write(outputFile.toPath(), decodedString);

            logger.debug("wrote local file: " + outputFile.getAbsolutePath() + ", filename: " + outputFile.getName());
            return true;
        } else {
            // Upload to AWS

            // Set supervision details metadata to S3 for KTV
            SupervisionMetadataDTO supervisionDetails = getSupervisionMetadata(supervisionId, objectKey, objectIdentifier, filename, fileCreated);

            boolean success = awss3Client.upload(decodedString, contentType, bucketName, AWSS3Client.SILLARI_BACKEND_ROLE_SESSION_NAME, supervisionDetails);
            if (success) {
                logger.debug("Uploaded to AWS: " + objectKey);
            } else {
                logger.warn("Upload to AWS failed: " + objectKey);
            }
            return success;
        }
    }

    private SupervisionMetadataDTO getSupervisionMetadata(Integer supervisionId, String objectKey, String objectIdentifier, String filename, OffsetDateTime fileCreated) {
        SupervisionMetadataDTO dto = new SupervisionMetadataDTO();

        SupervisionModel supervision = supervisionRepository.getSupervisionById(supervisionId);
        SupervisionReportModel report = supervisionReportRepository.getSupervisionReport(supervisionId);
        supervision.setReport(report);
        // Sets also current status and status timestamps
        supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervisionId));

        RouteBridgeModel routeBridge = supervision.getRouteBridge();
        PermitModel permit = permitRepository.getPermitByRouteId(routeBridge.getRouteId());

        BridgeModel bridge = routeBridge.getBridge();
        CoordinatesDTO coords = bridgeRepository.getBridgeCoordinates(bridge.getId());
        if (coords.getX() != null && coords.getY() != null) {
            bridge.setCoordinates(coords);
        }

        dto.setObjectIdentifier(objectIdentifier);
        dto.setObjectKey(objectKey);
        dto.setFilename(filename);
        dto.setCreatedTime(fileCreated);
        dto.setSupervisionId(supervisionId);
        dto.setPermitNumber(permit.getPermitNumber());
        dto.setSupervisionStartedTime(supervision.getStartedTime());
        dto.setSupervisionFinishedTime(supervision.getFinishedTime());
        // Add exceptional info only if report is ready
        if (report != null && supervision.getCurrentStatus() != null && supervision.getCurrentStatus().getStatus().equals(SupervisionStatusType.REPORT_SIGNED)) {
            boolean exceptional = report.getAnomalies() || !report.getSpeedLimitOk() || !report.getDrivingLineOk();
            dto.setSupervisionExceptional(exceptional);
        }
        dto.setBridgeName(bridge.getName());
        dto.setBridgeIdentifier(bridge.getIdentifier());
        dto.setBridgeOid(bridge.getOid());
        if (bridge.getCoordinates() != null) {
            dto.setBridgeXCoordinate(bridge.getCoordinates().getX());
            dto.setBridgeYCoordinate(bridge.getCoordinates().getY());
        }
        dto.setBridgeRoadAddress(bridge.getRoadAddress());
        return dto;
    }

    public void deleteFile(String bucketName, String objectKey, String filename) throws IOException {
        if (activeProfile.equals("local")) {
            // Delete from local file system
            File deleteFile = new File(filename);
            if (deleteFile.exists()) {
                Files.delete(deleteFile.toPath());
            }
        } else {
            // Delete from AWS
            awss3Client.delete(objectKey, bucketName);
        }
    }

    public void expireFile(String bucketName, String objectKey, String filename) throws IOException {
        if (activeProfile.equals("local")) {
            File deleteFile = new File(filename);
            if (deleteFile.exists()) {
                Files.delete(deleteFile.toPath());
            }
        } else {
            awss3Client.tagExpired(objectKey, bucketName);
        }
    }

}
