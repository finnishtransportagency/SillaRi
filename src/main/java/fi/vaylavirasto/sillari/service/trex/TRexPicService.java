package fi.vaylavirasto.sillari.service.trex;

import fi.vaylavirasto.sillari.api.rest.error.TRexRestException;
import fi.vaylavirasto.sillari.model.BridgeImageModel;
import fi.vaylavirasto.sillari.model.PicInfoModel;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJsonMapper;
import fi.vaylavirasto.sillari.service.trex.bridgePicInterface.KuvatiedotItem;
import fi.vaylavirasto.sillari.service.trex.bridgePicInterface.TrexPicInfoResponseJson;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.NoSuchElementException;

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


    private final TrexBridgeInfoResponseJsonMapper dtoMapper = Mappers.getMapper(TrexBridgeInfoResponseJsonMapper.class);


    public PicInfoModel getPicInfo(String oid) {
        logger.debug("getPicInfo oid: " + oid);
        TrexPicInfoResponseJson picInfoResponseJson = null;
        try {
            picInfoResponseJson = getPicInfoJson(oid);
        } catch (TRexRestException e) {
            logger.error("Trex pics getting failed. " + e.getMessage());
            return null;
        }
        try {
            KuvatiedotItem kuvatiedotItem = picInfoResponseJson.getKuvatiedot().stream().filter(i -> i.getPaakuva().isTotuusarvo()).findFirst().orElseThrow();
            PicInfoModel picInfoModel = dtoMapper.fromDTOToModel(kuvatiedotItem);
            return picInfoModel;
        } catch (NoSuchElementException e) {
            logger.warn("Couldn't get bridge pics from trex. Probably no pics in trex fot the bridge. " + e.getMessage());
        }
        return null;
    }


    public BridgeImageModel getPicFromTrex(String oid, Integer bridgeId) {

        PicInfoModel picInfo = getPicInfo(oid);
        logger.debug("Got picinfo from trex: " + picInfo);

        if (picInfo != null) {
            byte[] picBytes = new byte[0];
            try {
                picBytes = getPicBinJson(oid, String.valueOf(picInfo.getId()));
            } catch (TRexRestException e) {
                logger.error("Failed getting pic bytes from trex: " + e.getMessage());
                return null;
            }
            logger.debug("Got picbytes from trex: " + picBytes.length);

            BridgeImageModel bridgeImageModel = new BridgeImageModel();
            bridgeImageModel.setBridgeId(bridgeId);
            bridgeImageModel.setFilename(oid + ".jpeg");
            bridgeImageModel.setObjectKey(oid);
            bridgeImageModel.setTaken(picInfo.getTaken());


            String encodedString = org.apache.tomcat.util.codec.binary.Base64.encodeBase64String(picBytes);
            bridgeImageModel.setBase64("data:" + "jpeg/image" + ";base64," + encodedString);
            logger.debug("createdBridgeImage with 64: " + bridgeImageModel);

            return bridgeImageModel;

        } else {
            return null;
        }
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
}


