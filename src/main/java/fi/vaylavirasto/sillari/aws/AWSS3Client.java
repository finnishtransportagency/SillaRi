package fi.vaylavirasto.sillari.aws;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.securitytoken.AWSSecurityTokenService;
import com.amazonaws.services.securitytoken.AWSSecurityTokenServiceClientBuilder;
import com.amazonaws.services.securitytoken.model.AssumeRoleRequest;
import com.amazonaws.services.securitytoken.model.AssumeRoleResult;
import com.amazonaws.services.securitytoken.model.Credentials;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.util.Date;

@Component
public class AWSS3Client {
    private static final Logger logger = LogManager.getLogger();
    private AmazonS3 s3Client=null;
    private static final String bucketName = "sillari-photos";
    private final String roleArn;
    private final String accessKey;
    private final String secretKey;
    public AWSS3Client() {
        accessKey = System.getenv("accessKey");
        secretKey = System.getenv("secretKey");
        roleArn = System.getenv("roleArn");
    }
    private void init() {
        if(s3Client == null) {

            BasicAWSCredentials basicAWSCredentials = new BasicAWSCredentials(accessKey, secretKey);
            AWSCredentialsProvider credentialsProvider = new AWSStaticCredentialsProvider(basicAWSCredentials);
            AWSSecurityTokenService stsClient = AWSSecurityTokenServiceClientBuilder.standard()
                    .withRegion(Regions.EU_WEST_1)
                    .withCredentials(credentialsProvider)
                    .build();
            AssumeRoleRequest roleRequest = new AssumeRoleRequest()
                    .withRoleArn(roleArn)
                    .withRoleSessionName("SILLARI-PHOTOS");

            AssumeRoleResult roleResponse = stsClient.assumeRole(roleRequest);
            Credentials myCreds = roleResponse.getCredentials();

            Date exTime = myCreds.getExpiration();
            String tokenInfo = myCreds.getSessionToken();

            BasicSessionCredentials awsCreds = new BasicSessionCredentials(myCreds.getAccessKeyId(),myCreds.getSecretAccessKey(),myCreds.getSessionToken());
            AWSCredentialsProvider rolecredentialsProvider = new AWSStaticCredentialsProvider(awsCreds);

            System.out.println("The token "+tokenInfo + "  expires on " + exTime );
            s3Client = AmazonS3ClientBuilder.standard()
                    .withRegion(Regions.EU_WEST_1)
                    .withCredentials(rolecredentialsProvider)
                    .build();
        }
    }
    public boolean upload(String key, byte photo[]) {
        try {
            init();
            ByteArrayInputStream byteInputStream = new ByteArrayInputStream(photo);
            ObjectMetadata metadata = new ObjectMetadata();
            PutObjectRequest request = new PutObjectRequest(bucketName, key+".jpg", byteInputStream, metadata);
            s3Client.putObject(request);
        } catch(Exception e) {
            logger.error(e);
        }
        return false;
    }
}
