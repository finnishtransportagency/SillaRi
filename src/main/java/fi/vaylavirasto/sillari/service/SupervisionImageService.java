package fi.vaylavirasto.sillari.service;

import com.amazonaws.util.IOUtils;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.dto.CoordinatesDTO;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionImageModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionImageRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;

@Service
public class SupervisionImageService {
    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    SupervisionImageRepository supervisionImageRepository;
    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    BridgeRepository bridgeRepository;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    public SupervisionImageModel getSupervisionImage(Integer id) {
        return supervisionImageRepository.getFile(id);
    }

    public SupervisionImageModel createSupervisionImage(SupervisionImageModel supervisionImage) {
        Integer id = supervisionImageRepository.insertFileIfNotExists(supervisionImage);
        return supervisionImageRepository.getFile(id);
    }

    public void deleteSupervisionImage(Integer id) throws IOException {
        SupervisionImageModel image = getSupervisionImage(id);

        // Delete image from AWS bucket or local file system
        deleteFile(image.getObjectKey(), image.getFilename());

        // Delete the image row from the database
        supervisionImageRepository.deleteFileByImageId(id);
    }

    public void deleteSupervisionImages(Integer supervisionId) throws IOException {
        List<SupervisionImageModel> images = supervisionImageRepository.getFiles(supervisionId);

        // Delete images from AWS bucket or local file system
        for (SupervisionImageModel image : images) {
            String decodedKey = new String(Base64.getDecoder().decode(image.getObjectKey()));
            deleteFile(decodedKey, image.getFilename());
        }

        // Delete image rows from the database
        supervisionImageRepository.deleteFilesBySupervisionId(supervisionId);
    }

    public void getImageFile(HttpServletResponse response, SupervisionImageModel supervisionImageModel) throws IOException {
        // Determine the content type from the file extension, which could be jpg, jpeg, png or gif
        String filename = supervisionImageModel.getFilename();
        String extension = filename.substring(filename.lastIndexOf(".") + 1);
        String contentType = extension.equals("jpg") ? "image/jpeg" : "image/" + extension;

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
            String objectKey = supervisionImageModel.getObjectKey();
            byte[] image = awss3Client.download(objectKey, awss3Client.getPhotoBucketName());
            if (image != null) {
                response.setContentType(contentType);
                OutputStream out = response.getOutputStream();
                ByteArrayInputStream in = new ByteArrayInputStream(image);
                IOUtils.copy(in, out);
                out.close();
                in.close();
            }
        }
    }

    public void saveImageFile(SupervisionImageModel image, byte[] decodedString, String contentType) throws IOException {
        if (activeProfile.equals("local")) {
            // Save to local file system
            File outputFile = new File("/", image.getFilename());
            Files.write(outputFile.toPath(), decodedString);
        } else {
            // Upload to AWS
            String objectIdentifier = image.getKtvObjectId();
            String objectKey = image.getObjectKey();

            // Set bridge details metadata to S3 for KTV
            SupervisionModel supervision = supervisionRepository.getSupervisionById(image.getSupervisionId());
            BridgeModel bridge = supervision.getRouteBridge().getBridge();
            CoordinatesDTO coords = bridgeRepository.getBridgeCoordinates(bridge.getId());
            if (coords.getX() != null && coords.getY() != null) {
                bridge.setCoordinates(coords);
            }

            awss3Client.upload(objectKey, objectIdentifier, decodedString, contentType, awss3Client.getPhotoBucketName(), AWSS3Client.SILLARI_PHOTOS_ROLE_SESSION_NAME, bridge);
        }
    }

    private void deleteFile(String decodedKey, String filename) throws IOException {
        if (activeProfile.equals("local")) {
            // Delete from local file system
            File deleteFile = new File(filename);
            if (deleteFile.exists()) {
                Files.delete(deleteFile.toPath());
            }
        } else {
            // Delete from AWS
            awss3Client.delete(decodedKey, awss3Client.getPhotoBucketName());
        }
    }

    //todo remove. This is for testing image expiration. Expiration should not remove pics from KTV.
    //So we dont delete it from S3 but tag it expired,
    public void expireSupervisionImage(Integer imageId) throws IOException {
        SupervisionImageModel image = getSupervisionImage(imageId);

        if (activeProfile.equals("local")) {
            String filename = image.getFilename();
            File deleteFile = new File(filename);
            if (deleteFile.exists()) {
                Files.delete(deleteFile.toPath());
            }
        } else {
            awss3Client.tagExpired(image.getObjectKey(), awss3Client.getPhotoBucketName());
        }

        supervisionImageRepository.deleteFileByImageId(imageId);
    }

}
