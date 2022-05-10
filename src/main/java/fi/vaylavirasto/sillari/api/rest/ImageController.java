package fi.vaylavirasto.sillari.api.rest;

import com.amazonaws.util.IOUtils;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.dto.CoordinatesDTO;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionImageModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.service.BridgeService;
import fi.vaylavirasto.sillari.service.SupervisionImageService;
import fi.vaylavirasto.sillari.service.SupervisionService;
import fi.vaylavirasto.sillari.service.UIService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    SupervisionService supervisionService;
    @Autowired
    BridgeService bridgeService;

    @Autowired
    UIService uiService;


    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    @Operation(summary = "Get image")
    @GetMapping("/get")
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public void getImage(HttpServletResponse response, @RequestParam Integer id) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "getImage");
        try {
            if (!isSupervisionImageOfSupervisor(id)) {
                throw new AccessDeniedException("Image not of the user");
            }

            // Determine the content type from the file extension, which could be jpg, jpeg, png or gif
            SupervisionImageModel supervisionImageModel = supervisionImageService.getSupervisionImage(id);
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
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Upload image")
    @PostMapping("/upload")
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public SupervisionImageModel uploadImage(@RequestBody SupervisionImageModel fileInputModel) {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "uploadImage");
        SupervisionImageModel model = new SupervisionImageModel();
        try {
            if (!canSupervisorUpdateSupervision(fileInputModel.getSupervisionId())) {
                throw new AccessDeniedException("Supervision not of the user");
            }

            model.setObjectKey("supervision/" + fileInputModel.getSupervisionId() + "/" + fileInputModel.getFilename());
            model.setFilename(fileInputModel.getFilename());
            model.setTaken(fileInputModel.getTaken());
            model.setSupervisionId(fileInputModel.getSupervisionId());
            model.setBase64(fileInputModel.getBase64());
            model = supervisionImageService.createFile(model);

            Tika tika = new Tika();
            int dataStart = fileInputModel.getBase64().indexOf(",") + 1;
            byte[] decodedString = org.apache.tomcat.util.codec.binary.Base64.decodeBase64(fileInputModel.getBase64().substring(dataStart).getBytes(StandardCharsets.UTF_8));
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


                //set coord and street address metadata to S3 for KTV
                SupervisionModel supervision = supervisionService.getSupervision(model.getSupervisionId(), false, false);
                BridgeModel bridge = supervision.getRouteBridge().getBridge();

                CoordinatesDTO coords = bridgeService.getBridgeCoordinates(bridge.getId());

                Map<String, String> metadata = new HashMap<>();
                if (coords != null) {
                    metadata.put("x_coord", "" + coords.getX());
                    metadata.put("y_coord", "" + coords.getY());
                }
                metadata.put("roadAddress", bridge.getRoadAddress());
                metadata.put("sillariBridgeOid", "" + bridge.getOid());
                metadata.put("sillariBridgeName", "" + bridge.getName());
                metadata.put("imageIdentifier", "" + model.getId());

                awss3Client.upload(model.getObjectKey(), decodedString, contentType, awss3Client.getPhotoBucketName(), AWSS3Client.SILLARI_PHOTOS_ROLE_SESSION_NAME, metadata);
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
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public boolean deleteImage(HttpServletResponse response, @RequestParam Integer id) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "deleteImage");
        try {
            if (!isSupervisionImageOfSupervisor(id)) {
                throw new AccessDeniedException("Image not of the user");
            }

            String objectKey = supervisionImageService.getSupervisionImage(id).getObjectKey();
            // Delete image from AWS bucket or local file system
            deleteFile(objectKey);

            // Delete the image row from the database
            supervisionImageService.deleteSupervisionImage(id);
        } finally {
            serviceMetric.end();
        }
        return true;
    }

    @Operation(summary = "Delete all supervision images")
    @DeleteMapping("/deletesupervisionimages")
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public boolean deleteSupervisionImages(@RequestParam Integer supervisionId) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "deletesupervisionimages");
        try {
            if (!canSupervisorUpdateSupervision(supervisionId)) {
                throw new AccessDeniedException("Supervision not of the user");
            }
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


    /* Check that image belongs to a supervision of the user */
    private boolean isSupervisionImageOfSupervisor(Integer imageId) {
        SupervisionModel supervisionOfImage = supervisionService.getSupervisionBySupervisionImageId(imageId);
        SillariUser user = uiService.getSillariUser();
        List<SupervisionModel> supervisionsOfSupervisor = supervisionService.getAllSupervisionsOfSupervisorNoDetails(user.getUsername());

        return supervisionsOfSupervisor.stream().anyMatch(s-> s.getId().equals(supervisionOfImage.getId()));
    }

    /* Check that supervision belongs to the user and report is not signed */
    private boolean canSupervisorUpdateSupervision(Integer supervisionId) {
        SupervisionModel supervision = supervisionService.getSupervision(supervisionId);
        SillariUser user = uiService.getSillariUser();
        List<SupervisionModel> supervisionsOfSupervisor = supervisionService.getUnsignedSupervisionsOfSupervisorNoDetails(user.getUsername());

        return supervisionsOfSupervisor.stream().anyMatch(s-> s.getId().equals(supervision.getId()));
    }
}
