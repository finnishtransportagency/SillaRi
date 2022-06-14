package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.BridgeImageModel;
import fi.vaylavirasto.sillari.repositories.BridgeImageRepository;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;

@Service
public class BridgeImageService {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    BridgeRepository bridgeRepository;
    @Autowired
    BridgeImageRepository bridgeImageRepository;
    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    S3FileService s3FileService;

    public void saveBridgeIntoDBAndS3(BridgeImageModel bridgeImageModel) {
        //delete older same bridge pic from db if exists
        deleteImageFromDB(bridgeImageModel.getObjectKey());

        createBridgeImageIntoDB(bridgeImageModel);

        // Delete old image from AWS bucket or local file system
        deleteImageFileFromS3(bridgeImageModel.getObjectKey(), bridgeImageModel.getFilename());

        saveImageFileIntoS3(bridgeImageModel);
    }

    public BridgeImageModel getBridgeImage(Integer bridgeId) {
        return bridgeImageRepository.getBridgeImageWithBridgeId(bridgeId);
    }

    public void getImageFile(HttpServletResponse response, BridgeImageModel bridgeImageModel) throws IOException {
        // Determine the content type from the file extension, which could be jpg, jpeg, png or gif
        String filename = bridgeImageModel.getFilename();
        String extension = filename.substring(filename.lastIndexOf(".") + 1);
        String contentType = extension.equals("jpg") ? "image/jpeg" : "image/" + extension;

        s3FileService.getFile(response, awss3Client.getTrexPhotoBucketName(), bridgeImageModel.getObjectKey(), filename, contentType);
    }


    private BridgeImageModel createBridgeImageIntoDB(BridgeImageModel bridgeImage) {
        bridgeImageRepository.deleteBridgeImage(bridgeImage.getObjectKey());
        Integer id = bridgeImageRepository.insertBridgeImage(bridgeImage);
        BridgeImageModel bridgeImageModel = bridgeImageRepository.getBridgeImage(id);
        return bridgeImageModel;
    }

    private void deleteImageFileFromS3(String objectkey, String filename){
        // Delete image from AWS bucket or local file system
        s3FileService.deleteFile(awss3Client.getTrexPhotoBucketName(), objectkey, filename);
    }

    private void deleteImageFromDB(String objectkey){
        // Delete the image row from the database
        bridgeImageRepository.deleteBridgeImage(objectkey);
    }

    private void saveImageFileIntoS3(BridgeImageModel image){
        Tika tika = new Tika();
        int dataStart = image.getBase64().indexOf(",") + 1;
        logger.debug("datastart_ " + dataStart);
        byte[] decodedString = org.apache.tomcat.util.codec.binary.Base64.decodeBase64(image.getBase64().substring(dataStart).getBytes(StandardCharsets.UTF_8));
        logger.debug("decodedString " + decodedString);
        String contentType = tika.detect(decodedString);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        OffsetDateTime createdTime = image.getTaken();
        s3FileService.saveFile(decodedString, contentType, awss3Client.getPhotoBucketName(), image.getObjectKey(), image.getFilename(), createdTime);
    }


}
