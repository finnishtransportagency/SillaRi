package fi.vaylavirasto.sillari.service.trex;

import fi.vaylavirasto.sillari.api.rest.error.TRexRestException;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.BridgeImageModel;
import fi.vaylavirasto.sillari.model.PicInfoModel;
import fi.vaylavirasto.sillari.repositories.BridgeImageRepository;
import fi.vaylavirasto.sillari.service.S3FileService;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJsonMapper;
import fi.vaylavirasto.sillari.service.trex.bridgePicInterface.KuvatiedotItem;
import fi.vaylavirasto.sillari.service.trex.bridgePicInterface.TrexPicInfoResponseJson;
import fi.vaylavirasto.sillari.util.DateMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tika.Tika;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;

@Service
public class TRexPicService {
    private static final Logger logger = LogManager.getLogger();

    @Value("${sillari.trex.pic-url}")
    private String trexUrl;

    @Value("${sillari.trex.pic-info-path}")
    private String infoPath;

    @Value("${sillari.trex.pic-bin-path}")
    private String binPath;

    @Value("${sillari.trex.username}")
    private String username;
    @Value("${sillari.trex.password}")
    private String password;

    @Autowired
    AWSS3Client awss3Client;
    @Autowired
    S3FileService s3FileService;
    @Autowired
    BridgeImageRepository bridgeImageRepository;

    private final TrexBridgeInfoResponseJsonMapper dtoMapper = Mappers.getMapper(TrexBridgeInfoResponseJsonMapper.class);

    public BridgeImageModel createBridgeImage(BridgeImageModel bridgeImage) {
        bridgeImageRepository.deleteBridgeImage(bridgeImage.getObjectKey());
        Integer id = bridgeImageRepository.insertBridgeImage(bridgeImage);
        BridgeImageModel bridgeImageModel = bridgeImageRepository.getBridgeImage(id);
        return bridgeImageModel;
    }

    public void saveImageFile(BridgeImageModel image) throws IOException {
        Tika tika = new Tika();
        int dataStart = image.getBase64().indexOf(",") + 1;
        logger.debug("datastart_ " + dataStart);
        byte[] decodedString = org.apache.tomcat.util.codec.binary.Base64.decodeBase64(image.getBase64().substring(dataStart).getBytes(StandardCharsets.UTF_8));
        logger.debug("decodedString " + decodedString);
        String contentType = tika.detect(decodedString);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        OffsetDateTime createdTime = image.getTaken();
        s3FileService.saveFile(decodedString, contentType, awss3Client.getPhotoBucketName(), image.getObjectKey(), image.getFilename(), createdTime);
    }

    public void deleteImageFile(String objectkey, String filename) throws IOException {
        // Delete image from AWS bucket or local file system
        s3FileService.deleteFile(awss3Client.getTrexPhotoBucketName(), objectkey, filename);
    }

    public void deleteImage(String objectkey){
        // Delete the image row from the database
        bridgeImageRepository.deleteBridgeImage(objectkey);
    }

    public PicInfoModel getPicInfo(String oid) throws TRexRestException {
        logger.debug("getPicInfo oid: " + oid);
        TrexPicInfoResponseJson picInfoResponseJson = getPicInfoJson(oid);
        KuvatiedotItem kuvatiedotItem = picInfoResponseJson.getKuvatiedot().stream().filter(i -> i.getPaakuva().isTotuusarvo()).findFirst().orElseThrow();

        PicInfoModel picInfoModel = dtoMapper.fromDTOToModel(kuvatiedotItem);

        return picInfoModel;
    }


    //•	Sitten voitte kysyä mitä kuvia milläkin rakenteella on: https://testiapi.vayla.fi/trex/rajapinta/rakennekuva-api/v1/kuvatiedot?oid=<rakenneoid>
    //	Tämä palauttaa listan kuvien tiedoista.

    public TrexPicInfoResponseJson getPicInfoJson(String bridgeOid) throws TRexRestException {

        logger.trace("bridgeOid: " + bridgeOid);

        if (bridgeOid != null) {
            WebClient webClient = buildClient();
            try {
                TrexPicInfoResponseJson picInfo = webClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path(infoPath)
                                .queryParam("oid", bridgeOid)
                                .build())
                        .headers(h -> h.setBasicAuth(username, password))
                        .retrieve()
                        .bodyToMono(TrexPicInfoResponseJson.class)
                        .block();
                logger.debug("picInfo: " + picInfo);
                return picInfo;
            } catch (WebClientResponseException e) {
                logger.error(e.getMessage() + e.getStatusCode());
                throw new TRexRestException(e.getMessage(), e.getStatusCode());
            }

        } else {
            return null;
        }
    }


    //•	Kuvien binäärejä voitte sitten kysyä: https://testiapi.vayla.fi/trex/rajapinta/rakennekuva-api/v1/yleiskuva?oid=<rakenneoid>&id=<kuvaid>
    public byte[] getPicBinJson(String bridgeOid, String picId) throws TRexRestException {

        logger.debug("bridgeOid: " + bridgeOid);

        if (bridgeOid != null) {
            WebClient webClient = buildClient();

            try {
                byte[] picBin = webClient.mutate().codecs(configurer -> configurer
                                .defaultCodecs()
                                .maxInMemorySize(16 * 1024 * 1024)).build().get()
                        .uri(uriBuilder -> uriBuilder
                                .path(binPath)
                                .queryParam("oid", bridgeOid)
                                .queryParam("kuvaId", picId)
                                .build())
                        .headers(h -> h.setBasicAuth(username, password))
                        .retrieve()
                        .bodyToMono(byte[].class)
                        .block();
                logger.debug("picBin: " + picBin);
                return picBin;
            } catch (WebClientResponseException e) {
                logger.error(e.getMessage() + e.getStatusCode());
                throw new TRexRestException(e.getMessage(), e.getStatusCode());
            }

        } else {
            return null;
        }
    }

    private WebClient buildClient() {
        return WebClient.create(trexUrl);
    }

    public BridgeImageModel getBridgeImage(Integer bridgeId) {
        return bridgeImageRepository.getBridgeImageWithBridgeId(bridgeId);
    }

    public void getImageFile(HttpServletResponse response, BridgeImageModel bridgeImageModel) throws IOException {
        // Determine the content type from the file extension, which could be jpg, jpeg, png or gif
        String filename = bridgeImageModel.getFilename();
        String extension = filename.substring(filename.lastIndexOf(".") + 1);
        String contentType = extension.equals("jpg") ? "image/jpeg" : "image/" + extension;

        s3FileService.getFile(response, awss3Client.getTrexPhotoBucketName(), bridgeImageModel.getObjectKey(), filename, contentType);
    }
}
