package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.SupervisionImageModel;
import fi.vaylavirasto.sillari.repositories.SupervisionImageRepository;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@Service
public class SupervisionImageService {
    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    S3FileService s3FileService;
    @Autowired
    SupervisionImageRepository supervisionImageRepository;

    public SupervisionImageModel getSupervisionImage(Integer id) {
        return supervisionImageRepository.getSupervisionImage(id);
    }

    public SupervisionImageModel createSupervisionImage(SupervisionImageModel supervisionImage) {
        Integer id = supervisionImageRepository.insertSupervisionImageIfNotExists(supervisionImage);
        return supervisionImageRepository.getSupervisionImage(id);
    }

    public void deleteSupervisionImage(Integer id) throws IOException {
        SupervisionImageModel image = getSupervisionImage(id);

        // Delete image from AWS bucket or local file system
        s3FileService.deleteFile(awss3Client.getPhotoBucketName(), image.getObjectKey(), image.getFilename());

        // Delete the image row from the database
        supervisionImageRepository.deleteSupervisionImage(id);
    }

    public void deleteSupervisionImages(Integer supervisionId) throws IOException {
        List<SupervisionImageModel> images = supervisionImageRepository.getSupervisionImages(supervisionId);

        // Delete images from AWS bucket or local file system
        for (SupervisionImageModel image : images) {
            // getSupervisionImages returns base64 encoded string, must decode
            String decodedKey = new String(Base64.getDecoder().decode(image.getObjectKey()));
            s3FileService.deleteFile(awss3Client.getPhotoBucketName(), decodedKey, image.getFilename());
        }

        // Delete image rows from the database
        supervisionImageRepository.deleteSupervisionImages(supervisionId);
    }

    public void getImageFile(HttpServletResponse response, SupervisionImageModel supervisionImage) throws IOException {
        // Determine the content type from the file extension, which could be jpg, jpeg, png or gif
        String filename = supervisionImage.getFilename();
        String extension = filename.substring(filename.lastIndexOf(".") + 1);
        String contentType = extension.equals("jpg") ? "image/jpeg" : "image/" + extension;

        s3FileService.getFile(response, awss3Client.getPhotoBucketName(), supervisionImage.getObjectKey(), filename, contentType);
    }

    public void saveImageFile(SupervisionImageModel image) throws IOException {
        Tika tika = new Tika();
        int dataStart = image.getBase64().indexOf(",") + 1;
        byte[] decodedString = org.apache.tomcat.util.codec.binary.Base64.decodeBase64(image.getBase64().substring(dataStart).getBytes(StandardCharsets.UTF_8));
        String contentType = tika.detect(decodedString);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        s3FileService.saveFile(image.getSupervisionId(), decodedString, awss3Client.getPhotoBucketName(), image.getObjectKey(), image.getKtvObjectId(), image.getFilename(), contentType);
    }

    //todo remove. This is for testing image expiration. Expiration should not remove pics from KTV.
    //So we dont delete it from S3 but tag it expired,
    public void expireSupervisionImage(Integer imageId) throws IOException {
        SupervisionImageModel image = getSupervisionImage(imageId);

        s3FileService.expireFile(awss3Client.getPhotoBucketName(), image.getObjectKey(), image.getFilename());

        supervisionImageRepository.deleteSupervisionImage(imageId);
    }

}
