package fi.vaylavirasto.sillari.api.graphql;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.FileModel;
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
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public FileModel singleUpload(String crossingId, String filename, String base64) {
        FileModel model = new FileModel();
        model.setId(1L);
        model.setFilename(filename);
        model.setMimetype("");
        model.setEncoding("");
        try {
            byte[] decodedString = Base64.decodeBase64(new String(base64).getBytes("UTF-8"));
            String key = "crossings/"+crossingId+"/"+filename;
            awss3Client.upload(key,decodedString);
        } catch(Exception e) {
            e.printStackTrace();
        }
        return model;
    }
}
