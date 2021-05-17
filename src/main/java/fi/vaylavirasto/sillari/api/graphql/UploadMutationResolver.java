package fi.vaylavirasto.sillari.api.graphql;

import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.FileModel;
import fi.vaylavirasto.sillari.service.FileService;
import graphql.kickstart.tools.GraphQLMutationResolver;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.apache.tika.Tika;

import java.io.File;
import java.nio.file.Files;

@Component
public class UploadMutationResolver implements GraphQLMutationResolver {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    FileService fileService;
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public FileModel singleUpload(String crossingId, String filename, String base64, String taken) {
        FileModel model = new FileModel();
        model.setObjectKey("crossings/"+crossingId+"/"+filename);
        model.setFilename(filename);
        model.setMimetype("");
        model.setEncoding("");
        model.setTaken(taken);
        model.setCrossingId(Long.valueOf(crossingId));
        Tika tika = new Tika();
        model = fileService.createFile(model);
        File outputFile = new File("/outputFile.jpg");
        try {
            byte[] decodedString = Base64.decodeBase64(base64.substring(23).getBytes("UTF-8"));
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
