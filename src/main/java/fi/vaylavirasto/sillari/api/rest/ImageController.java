package fi.vaylavirasto.sillari.api.rest;

import com.amazonaws.util.IOUtils;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.FileInputModel;
import fi.vaylavirasto.sillari.model.FileModel;
import fi.vaylavirasto.sillari.service.FileService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

@RestController
@Timed
@RequestMapping("/images")
public class ImageController {
    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    FileService fileService;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    @Operation(summary = "Get image")
    @GetMapping("/get")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public void getImage(HttpServletResponse response, @RequestParam String objectKey) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "getImage");
        try {
            String decodedKey = new String(Base64.getDecoder().decode(objectKey));

            if (activeProfile.equals("local")) {
                // Get from local file system
                String filename = decodedKey.substring(decodedKey.lastIndexOf("/"));

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
                byte[] image = awss3Client.download(decodedKey);
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
    public FileModel uploadImage(@RequestBody FileInputModel fileInputModel) {
        ServiceMetric serviceMetric = new ServiceMetric("ImageController", "uploadImage");
        FileModel model = new FileModel();
        try {
            model.setObjectKey("supervision/" + fileInputModel.getSupervisionId() + "/" + fileInputModel.getFilename());
            model.setFilename(fileInputModel.getFilename());
            model.setMimetype("");
            model.setEncoding("");
            model.setTaken(fileInputModel.getTaken());
            model.setSupervisionId(Integer.parseInt(fileInputModel.getSupervisionId()));
            model = fileService.createFile(model);

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
                awss3Client.upload(model.getObjectKey(), decodedString, decodedString.length, contentType);
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

            if (activeProfile.equals("local")) {
                // Delete from local file system
                String filename = decodedKey.substring(decodedKey.lastIndexOf("/"));

                File deleteFile = new File("/", filename);
                if (deleteFile.exists()) {
                    Files.delete(deleteFile.toPath());
                }
            } else {
                // Delete from AWS
                awss3Client.delete(decodedKey);
            }

            // Delete the image row from the database
            fileService.deleteFile(decodedKey);
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
}
