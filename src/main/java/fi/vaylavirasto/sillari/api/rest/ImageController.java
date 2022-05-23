package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@Timed
@RequestMapping("/images")
public class ImageController {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    SupervisionImageService supervisionImageService;
    @Autowired
    SupervisionService supervisionService;
    @Autowired
    UIService uiService;


    @Operation(summary = "Get image")
    @GetMapping("/get")
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public void getImage(HttpServletResponse response, @RequestParam Integer id) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "getImage");
        try {
            if (!isSupervisionImageOfSupervisor(id)) {
                throw new AccessDeniedException("Image not of the user");
            }

            SupervisionImageModel supervisionImageModel = supervisionImageService.getSupervisionImage(id);
            // Get the file from S3 bucket or local file system and write to response
            supervisionImageService.getImageFile(response, supervisionImageModel);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Upload image")
    @PostMapping("/upload")
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public SupervisionImageModel uploadImage(@RequestBody SupervisionImageModel fileInputModel) {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "uploadImage");
        SupervisionImageModel image = new SupervisionImageModel();

        try {
            if (!canSupervisorUpdateSupervision(fileInputModel.getSupervisionId())) {
                throw new AccessDeniedException("Supervision not of the user");
            }

            image.setFilename(fileInputModel.getFilename());
            image.setTaken(fileInputModel.getTaken());
            image.setSupervisionId(fileInputModel.getSupervisionId());
            image.setBase64(fileInputModel.getBase64());
            // Object key and KTV object id are generated when image is inserted to DB
            image = supervisionImageService.createSupervisionImage(image);

            if (image.getId() != null && image.getObjectKey() != null && image.getKtvObjectId() != null) {
                Tika tika = new Tika();
                int dataStart = fileInputModel.getBase64().indexOf(",") + 1;
                byte[] decodedString = org.apache.tomcat.util.codec.binary.Base64.decodeBase64(fileInputModel.getBase64().substring(dataStart).getBytes(StandardCharsets.UTF_8));
                String contentType = tika.detect(decodedString);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                supervisionImageService.saveImageFile(image, decodedString, contentType);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            serviceMetric.end();
        }
        return image;
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
            supervisionImageService.deleteSupervisionImage(id);
        } finally {
            serviceMetric.end();
        }
        return true;
    }


    //todo remove. This is for testing image expiration. Expiration should not remove pics from KTV.
    //So we dont delete it from S3 but tag it expired,
    @Operation(summary = "Expire image")
    @DeleteMapping("/expire")
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public boolean expireImage(HttpServletResponse response, @RequestParam Integer id) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "deleteImage");
        try {
            if (!isSupervisionImageOfSupervisor(id)) {
                throw new AccessDeniedException("Image not of the user");
            }
            // Set image as expired in AWS bucket, delete image from DB
            supervisionImageService.expireSupervisionImage(id);
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
            supervisionImageService.deleteSupervisionImages(supervisionId);
        } finally {
            serviceMetric.end();
        }
        return true;
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

        return supervisionsOfSupervisor.stream().anyMatch(s -> s.getId().equals(supervisionOfImage.getId()));
    }

    /* Check that supervision belongs to the user and report is not signed */
    private boolean canSupervisorUpdateSupervision(Integer supervisionId) {
        SupervisionModel supervision = supervisionService.getSupervision(supervisionId);
        SillariUser user = uiService.getSillariUser();
        List<SupervisionModel> supervisionsOfSupervisor = supervisionService.getUnsignedSupervisionsOfSupervisorNoDetails(user.getUsername());

        return supervisionsOfSupervisor.stream().anyMatch(s -> s.getId().equals(supervision.getId()));
    }
}
