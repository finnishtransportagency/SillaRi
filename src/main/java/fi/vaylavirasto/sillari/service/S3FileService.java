package fi.vaylavirasto.sillari.service;

import com.amazonaws.util.IOUtils;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.dto.CoordinatesDTO;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;

@Service
public class S3FileService {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    BridgeRepository bridgeRepository;

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

    public boolean saveFile(byte[] decodedString, String bucketName, Integer supervisionId, String objectKey, String objectIdentifier, String filename, String contentType) throws IOException {
        if (activeProfile.equals("local")) {
            // Save to local file system
            File outputFile = new File("/", filename);
            Files.write(outputFile.toPath(), decodedString);

            logger.debug("wrote local file: " + outputFile.getAbsolutePath() + ", filename: " + outputFile.getName());
            return true;
        } else {
            // Upload to AWS

            // Set bridge details metadata to S3 for KTV
            SupervisionModel supervision = supervisionRepository.getSupervisionById(supervisionId);
            BridgeModel bridge = supervision.getRouteBridge().getBridge();
            CoordinatesDTO coords = bridgeRepository.getBridgeCoordinates(bridge.getId());
            if (coords.getX() != null && coords.getY() != null) {
                bridge.setCoordinates(coords);
            }

            boolean success = awss3Client.upload(objectKey, objectIdentifier, decodedString, contentType, bucketName, AWSS3Client.SILLARI_BACKEND_ROLE_SESSION_NAME, bridge);
            if (success) {
                logger.debug("Uploaded to AWS: " + objectKey);
            } else {
                logger.warn("Upload to AWS failed: " + objectKey);
            }
            return success;
        }
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
