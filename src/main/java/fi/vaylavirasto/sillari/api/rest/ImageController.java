package fi.vaylavirasto.sillari.api.rest;

import com.amazonaws.util.IOUtils;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.FileInputModel;
import fi.vaylavirasto.sillari.model.SupervisionImageModel;
import fi.vaylavirasto.sillari.service.CompanyService;
import fi.vaylavirasto.sillari.service.SupervisionImageService;
import fi.vaylavirasto.sillari.service.UIService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;

@RestController
@Timed
@RequestMapping("/images")
public class ImageController {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    SupervisionImageService supervisionImageService;
    @Autowired
    CompanyService companyService;
    @Autowired
    UIService uiService;


    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    @Operation(summary = "Get image")
    @GetMapping("/get")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public void getImage(HttpServletResponse response, @RequestParam Integer id) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "getImage");

        if (!isOwnCompanyImage(id)) {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            return;
        }

        String objectKey = supervisionImageService.getSupervisionImage(id).getObjectKey();
        try {
            if (activeProfile.equals("local")) {
                // Get from local file system
                String filename = objectKey.substring(objectKey.lastIndexOf("/"));

                File inputFile = new File("/", filename);
                if (inputFile.exists()) {
                    response.setContentType("image/jpeg");
                    OutputStream out = response.getOutputStream();
                    FileInputStream in = new FileInputStream(inputFile);
                    IOUtils.copy(in, out);
                    out.close();
                    in.close();
                }
            } else {
                // Get from AWS
                byte[] image = awss3Client.download(objectKey, awss3Client.getPhotoBucketName());
                if (image != null) {
                    response.setContentType("image/jpeg");
                    OutputStream out = response.getOutputStream();
                    ByteArrayInputStream in = new ByteArrayInputStream(image);
                    IOUtils.copy(in, out);
                    out.close();
                    in.close();
                }
            }
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Upload image")
    @PostMapping("/upload")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public SupervisionImageModel uploadImage(@RequestBody FileInputModel fileInputModel) {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "uploadImage");
        SupervisionImageModel model = new SupervisionImageModel();
        try {
            model.setObjectKey("supervision/" + fileInputModel.getSupervisionId() + "/" + fileInputModel.getFilename());
            model.setFilename(fileInputModel.getFilename());
            model.setMimetype("");
            model.setEncoding("");
            model.setTaken(fileInputModel.getTaken());
            model.setSupervisionId(Integer.parseInt(fileInputModel.getSupervisionId()));
            model = supervisionImageService.createFile(model);

            Tika tika = new Tika();
            int dataStart = fileInputModel.getBase64().indexOf(",") + 1;
            byte[] decodedString = org.apache.tomcat.util.codec.binary.Base64.decodeBase64(fileInputModel.getBase64().substring(dataStart).getBytes("UTF-8"));
            String contentType = tika.detect(decodedString);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            if (activeProfile.equals("local")) {
                // Save to local file system
                File outputFile = new File("/", fileInputModel.getFilename());
                Files.write(outputFile.toPath(), decodedString);
            } else {
                // Upload to AWS
                awss3Client.upload(model.getObjectKey(), decodedString,  contentType, awss3Client.getPhotoBucketName(), AWSS3Client.SILLARI_PHOTOS_ROLE_SESSION_NAME);
            }
        } catch(Exception e) {
            e.printStackTrace();
        } finally {
            serviceMetric.end();
        }
        return model;
    }

    @Operation(summary = "Delete image")
    @DeleteMapping("/delete")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public boolean deleteImage(HttpServletResponse response, @RequestParam String objectKey) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "deleteImage");
        try {
            String decodedKey = new String(Base64.getDecoder().decode(objectKey));
            // Delete image from AWS bucket or local file system
            deleteFile(decodedKey);

            // Delete the image row from the database
            supervisionImageService.deleteSupervisionImage(decodedKey);
        } finally {
            serviceMetric.end();
        }
        return true;
    }

    @Operation(summary = "Delete all supervision images")
    @DeleteMapping("/deletesupervisionimages")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public boolean deleteSupervisionImages(@RequestParam Integer supervisionId) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "deletesupervisionimages");

        try {
            List<SupervisionImageModel> images = supervisionImageService.getSupervisionImages(supervisionId);

            // Delete images from AWS bucket or local file system
            for (SupervisionImageModel image : images) {
                String decodedKey = new String(Base64.getDecoder().decode(image.getObjectKey()));
                deleteFile(decodedKey);
            }

            // Delete image rows from the database
            supervisionImageService.deleteSupervisionImages(supervisionId);
        } finally {
            serviceMetric.end();
        }
        return true;
    }

    private void deleteFile(String decodedKey) throws IOException {
        if (activeProfile.equals("local")) {
            // Delete from local file system
            String filename = decodedKey.substring(decodedKey.lastIndexOf("/"));

            File deleteFile = new File("/", filename);
            if (deleteFile.exists()) {
                Files.delete(deleteFile.toPath());
            }
        } else {
            // Delete from AWS
            awss3Client.delete(decodedKey, awss3Client.getPhotoBucketName());
        }
    }

    @Operation(summary = "Keep alive")
    @GetMapping("/keepalive")
    public String keepalive() {
        return "Alive";
    }


    /* Check that images permits company matches user company */
    private boolean isOwnCompanyImage(Integer imageId) {
        CompanyModel cm = companyService.getCompanyBySupervisionImageId(imageId);
        logger.debug("companyhello:" + cm.getId());
        logger.debug("companyhello:" + cm.getBusinessId());
        logger.debug("imageId:" + imageId);
        SillariUser user = uiService.getSillariUser();
        logger.debug("userhello:" + user.getBusinessId());
        return user.getBusinessId().equals(cm.getBusinessId());
    }
}
