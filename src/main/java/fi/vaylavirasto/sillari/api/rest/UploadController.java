package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.FileInputModel;
import fi.vaylavirasto.sillari.model.FileModel;
import fi.vaylavirasto.sillari.service.FileService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tika.Tika;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.nio.file.Files;

@RestController
@Timed
@RequestMapping("/upload")
public class UploadController {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    FileService fileService;

    @Operation(summary = "Single upload")
    @PostMapping("/singleupload")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public FileModel singleUpload(@RequestBody FileInputModel fileInputModel) {
        FileModel model = new FileModel();
        model.setObjectKey("crossings/" + fileInputModel.getCrossingId() + "/" + fileInputModel.getFilename());
        model.setFilename(fileInputModel.getFilename());
        model.setMimetype("");
        model.setEncoding("");
        model.setTaken(fileInputModel.getTaken());
        model.setCrossingId(Long.parseLong(fileInputModel.getCrossingId()));
        Tika tika = new Tika();
        model = fileService.createFile(model);
        File outputFile = new File("/outputFile.jpg");
        try {
            int dataStart = fileInputModel.getBase64().indexOf(",") + 1;
            byte[] decodedString = Base64.decodeBase64(fileInputModel.getBase64().substring(dataStart).getBytes("UTF-8"));
            String contentType = tika.detect(decodedString);
            Files.write(outputFile.toPath(), decodedString);
            if(contentType == null) {
                contentType="application/octet-stream";
            }
            awss3Client.upload(model.getObjectKey(),decodedString, decodedString.length, contentType);
        } catch(Exception e) {
            e.printStackTrace();
        }
        return model;
    }
}
