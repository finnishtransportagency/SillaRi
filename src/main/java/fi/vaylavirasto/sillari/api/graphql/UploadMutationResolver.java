package fi.vaylavirasto.sillari.api.graphql;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.FileModel;
import fi.vaylavirasto.sillari.service.FileService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

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
        model.setObjectKey("crossings/"+crossingId+"/"+filename+".jpg");
        model.setFilename(filename);
        model.setMimetype("");
        model.setEncoding("");
        model.setTaken(taken);
        model = fileService.createFile(model);
        try {
            byte[] decodedString = Base64.decodeBase64(new String(base64).getBytes("UTF-8"));
            awss3Client.upload(model.getObjectKey(),decodedString);
        } catch(Exception e) {
            e.printStackTrace();
        }
        return model;
    }
}
