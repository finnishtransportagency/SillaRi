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
import fi.vaylavirasto.sillari.model.BridgeModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class AWSS3Client {

    private static final Logger logger = LogManager.getLogger();
    public static final String SILLARI_PHOTOS_ROLE_SESSION_NAME = "SILLARI-PHOTOS";
    public static final String SILLARI_PERMITS_ROLE_SESSION_NAME = "SILLARI-PERMITS";
    private static final String KTV_OBJECT_IDENTIFIER_COMMON_PREFIX = "SIL";
    private AmazonS3 s3Client = null;

    private static final String SILLARI_PHOTOS_BUCKET_DEV = "sillari-photos";

    private static final String SILLARI_PERMIT_PDF_BUCKET_DEV = "sillari-permits";

    private static final String SILLARI_SUPERVISION_PDF_BUCKET_DEV = "sillari-supervisions";

    private final String roleArn;
    private String accessKey;
    private String secretKey;
    private final String environment;
    private AssumeRoleResult roleResponse = null;

    public AWSS3Client() {

        environment = System.getenv("environment");
        if ("localhost".equals(environment)) {
            accessKey = System.getenv("accessKey");
            secretKey = System.getenv("secretKey");
        }
        roleArn = System.getenv("roleArn");
        logger.info(environment);
    }

    public String getPermitBucketName() {
        if ("dev".equals(environment) || "localhost".equals(environment)) {
            return SILLARI_PERMIT_PDF_BUCKET_DEV;
        } else {
            return SILLARI_PERMIT_PDF_BUCKET_DEV + "-" + environment;
        }
    }

    public String getSupervisionBucketName() {
        if ("dev".equals(environment) || "localhost".equals(environment)) {
            return SILLARI_SUPERVISION_PDF_BUCKET_DEV;
        } else {
            return SILLARI_SUPERVISION_PDF_BUCKET_DEV + "-" + environment;
        }
    }

    public String getPhotoBucketName() {
        if ("dev".equals(environment) || "localhost".equals(environment)) {
            return SILLARI_PHOTOS_BUCKET_DEV;
        } else {
            return SILLARI_PHOTOS_BUCKET_DEV + "-" + environment;
        }
    }

    private void init(String sillariPhotosRoleSessionName) {
        if (roleResponse != null) {
            long now = new Date().getTime();
            if (roleResponse.getCredentials().getExpiration().getTime() < now + 60 * 1000L) {
                logger.debug("renew credentials " + roleResponse.getCredentials().getExpiration());
                s3Client = null;
            }
        }
        if (s3Client == null) {
            if ("localhost".equals(environment) || "dev".equals(environment)) {
                // localhost and dev: assume role is needed
                AWSSecurityTokenService stsClient;
                if ("localhost".equals(environment)) {
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
                        .withRoleSessionName(sillariPhotosRoleSessionName);

                roleResponse = stsClient.assumeRole(roleRequest);
                Credentials myCreds = roleResponse.getCredentials();

                Date exTime = myCreds.getExpiration();
                String tokenInfo = myCreds.getSessionToken();

                BasicSessionCredentials awsCreds = new BasicSessionCredentials(myCreds.getAccessKeyId(), myCreds.getSecretAccessKey(), myCreds.getSessionToken());
                AWSCredentialsProvider rolecredentialsProvider = new AWSStaticCredentialsProvider(awsCreds);

                System.out.println("The token " + tokenInfo + "  expires on " + exTime);
                s3Client = AmazonS3ClientBuilder.standard()
                        .withRegion(Regions.EU_WEST_1)
                        .withCredentials(rolecredentialsProvider)
                        .build();
            } else {
                // test, prod, preprod environments: ecs task used has required policies in task role
                s3Client = AmazonS3ClientBuilder.standard()
                        .withRegion(Regions.EU_WEST_1)
                        .build();

            }
        }
    }

    public boolean upload(String key, byte[] bytes, String contenttype, String bucketName, String sillariPhotosRoleSessionName) {
        return upload(key, bytes, contenttype, bucketName, sillariPhotosRoleSessionName, null);
    }

    public boolean upload(String key, byte[] bytes, String contenttype, String bucketName, String sillariPhotosRoleSessionName, Integer objectIdentifier, String objectIdentifierPrefix, BridgeModel bridge) {
        Map<String, String> metadata = new HashMap<>();

        if (bridge.getCoordinates() != null) {
            metadata.put("x_coord", "" + bridge.getCoordinates().getX());
            metadata.put("y_coord", "" + bridge.getCoordinates().getY());
        }

        if (bridge.getName() != null) {
            try {
                // Bridge names include scandic letters, so must encode them
                String bridgeName = URLEncoder.encode(bridge.getName(), StandardCharsets.UTF_8.toString());
                metadata.put("sillariBridgeName", bridgeName);
            } catch (UnsupportedEncodingException e) {
                logger.warn("Couldn't encode bridge name '{}' for file '{}'. Skipping bridge name from S3 metadata. ERROR={}", bridge.getName(), key, e + " " + e.getMessage());
            }
        }

        metadata.put("roadAddress", bridge.getRoadAddress());
        metadata.put("sillariBridgeId", "" + bridge.getId()); // TODO remove bridge id after no longer required in KTV integration
        metadata.put("bridgeOid", bridge.getOid());
        metadata.put("bridgeIdentifier", bridge.getIdentifier());
        metadata.put("objectIdentifier", KTV_OBJECT_IDENTIFIER_COMMON_PREFIX + "-" + (objectIdentifierPrefix != null ? objectIdentifierPrefix : "") + "-" + objectIdentifier);
        return upload(key, bytes, contenttype, bucketName, sillariPhotosRoleSessionName, metadata);
    }

    public boolean upload(String key, byte[] bytes, String contenttype, String bucketName, String sillariPhotosRoleSessionName, Map<String, String> userMetadata) {
        try {
            init(sillariPhotosRoleSessionName);
            logger.info("upload " + bucketName + " contenttype " + contenttype + " userMetadata " + userMetadata);
            ByteArrayInputStream byteInputStream = new ByteArrayInputStream(bytes);
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(contenttype);
            metadata.setContentLength(bytes.length);
            if (userMetadata != null) {
                for (Map.Entry<String, String> entry : userMetadata.entrySet()) {
                    metadata.addUserMetadata(entry.getKey(), entry.getValue());
                }
            }
            PutObjectRequest request = new PutObjectRequest(bucketName, key, byteInputStream, metadata);

            // Try uploading the file to S3. If upload fails, try uploading it without custom metadata.
            // That way we at least have the file in storage - but the upload to Kuvatietovarasto will fail without metadata.
            try {
                s3Client.putObject(request);
            } catch (Exception e) {
                logger.warn("Couldn't post file with key '{}' to S3. Re-trying without custom metadata={}. ERROR={}", key, userMetadata, e + " " + e.getMessage());
                metadata = new ObjectMetadata();
                metadata.setContentType(contenttype);
                metadata.setContentLength(bytes.length);
                request = new PutObjectRequest(bucketName, key, byteInputStream, metadata);
                s3Client.putObject(request);
            }
        } catch (Exception e) {
            logger.error("S3 upload failed. " + e + " " + e.getMessage());
            return false;
        }
        return true;
    }

    public byte[] download(String objectKey, String bucketName) {
        try {
            init(SILLARI_PHOTOS_ROLE_SESSION_NAME);
            logger.info("download " + bucketName + " objectKey " + objectKey);
            GetObjectRequest request = new GetObjectRequest(bucketName, objectKey);
            S3Object object = s3Client.getObject(request);
            return IOUtils.toByteArray(object.getObjectContent());
        } catch (Exception e) {
            logger.error(e);
        }
        return null;
    }

    public void delete(String objectKey, String bucketName) {
        try {
            init(SILLARI_PHOTOS_ROLE_SESSION_NAME);
            DeleteObjectRequest request = new DeleteObjectRequest(bucketName, objectKey);
            s3Client.deleteObject(request);
        } catch (Exception e) {
            logger.error(e);
        }
    }


}
