package fi.vaylavirasto.sillari.aws;

import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.securitytoken.AWSSecurityTokenService;
import com.amazonaws.services.securitytoken.AWSSecurityTokenServiceClientBuilder;
import com.amazonaws.services.securitytoken.model.AssumeRoleRequest;
import com.amazonaws.services.securitytoken.model.AssumeRoleResult;
import com.amazonaws.services.securitytoken.model.Credentials;
import com.amazonaws.util.IOUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.util.Base64;
import java.util.Date;

@Component
public class AWSS3Client {
    private static final Logger logger = LogManager.getLogger();
    private AmazonS3 s3Client=null;
    private static String bucketName = "sillari-photos";
    private final String roleArn;
    private String accessKey;
    private String secretKey;
    private final String environment;
    private AssumeRoleResult roleResponse = null;

    public AWSS3Client() {
        environment = System.getenv("environment");
        if("localhost".equals(environment)) {
            accessKey = System.getenv("accessKey");
            secretKey = System.getenv("secretKey");
        } if("test".equals(environment)) {
            bucketName = "sillari-photos-test";
        }
        roleArn = System.getenv("roleArn");
    }

    private void init() {
        if(roleResponse != null) {
            long now = new Date().getTime();
            if(roleResponse.getCredentials().getExpiration().getTime() < now + 60*1000L) {
                logger.debug("renew credentials " + roleResponse.getCredentials().getExpiration());
                s3Client=null;
            }
        }
        if(s3Client == null) {
            AWSSecurityTokenService stsClient;
            if("localhost".equals(environment)) {
                BasicAWSCredentials basicAWSCredentials = new BasicAWSCredentials(accessKey, secretKey);
                AWSCredentialsProvider credentialsProvider = new AWSStaticCredentialsProvider(basicAWSCredentials);
                stsClient = AWSSecurityTokenServiceClientBuilder.standard()
                        .withRegion(Regions.EU_WEST_1)
                        .withCredentials(credentialsProvider)
                        .build();
            } else {
                stsClient = AWSSecurityTokenServiceClientBuilder.standard()
                        .withRegion(Regions.EU_WEST_1)
                        .build();
            }

            AssumeRoleRequest roleRequest = new AssumeRoleRequest()
                    .withRoleArn(roleArn)
                    .withRoleSessionName("SILLARI-PHOTOS");

            roleResponse = stsClient.assumeRole(roleRequest);
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

    public boolean upload(String key, byte photo[], long length, String contenttype) {
        try {
            init();
            ByteArrayInputStream byteInputStream = new ByteArrayInputStream(photo);
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(contenttype);
            metadata.setContentLength(length);
            PutObjectRequest request = new PutObjectRequest(bucketName, key, byteInputStream, metadata);
            s3Client.putObject(request);
        } catch(Exception e) {
            logger.error(e);
        }
        return false;
    }

    public byte[] download(String objectKey) {
        try {
            init();
            GetObjectRequest request = new GetObjectRequest(bucketName, objectKey);
            S3Object object = s3Client.getObject(request);
            return IOUtils.toByteArray(object.getObjectContent());
        } catch(Exception e) {
            logger.error(e);
        }
        return null;
    }

    public void delete(String objectKey) {
        try {
            init();
            DeleteObjectRequest request = new DeleteObjectRequest(bucketName, objectKey);
            s3Client.deleteObject(request);
        } catch(Exception e) {
            logger.error(e);
        }
    }
}
