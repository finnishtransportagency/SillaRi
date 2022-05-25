package fi.vaylavirasto.sillari.service.trex;

import fi.vaylavirasto.sillari.api.rest.error.TRexRestException;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJsonMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
public class TRexPicService {
    private static final Logger logger = LogManager.getLogger();

    @Value("${sillari.trex.pic-url}")
    private String trexUrl;

    @Value("${sillari.trex.pic-info-path}")
    private String infoPath;

    @Value("${sillari.trex.pic-bin-path}")
    private String binPath;
    private final TrexBridgeInfoResponseJsonMapper dtoMapper = Mappers.getMapper(TrexBridgeInfoResponseJsonMapper.class);

    public PicInfoModel getPicInfo(String oid) throws TRexRestException {
        logger.debug("getPicInfo oid: " + oid);
        TrexPicInfoResponseJson picInfo = getBridgeInfo(oid);
        PicInfoModel picInfoModel = dtoMapper.fromDTOToModel(picInfo);
        logger.debug("picInfoModel: " + picInfoModel);
        return bridgeModel;
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
                        .retrieve()
                        .bodyToMono(TrexPicInfoResponseJson.class)
                        .block();
                logger.debug("picInfo: " + picInfo);
                return bridgeInfo;
            } catch (WebClientResponseException e) {
                logger.error(e.getMessage() + e.getStatusCode());
                throw new TRexRestException(e.getMessage(), e.getStatusCode());
            }

        } else {
            return null;
        }
    }


    //•	Kuvien binäärejä voitte sitten kysyä: https://testiapi.vayla.fi/trex/rajapinta/rakennekuva-api/v1/yleiskuva?oid=<rakenneoid>&id=<kuvaid>
    public TrexPicBinResponseJson getPicBinJson(String bridgeOid, String picId) throws TRexRestException {

        logger.trace("bridgeOid: " + bridgeOid);

        if (bridgeOid != null) {
            WebClient webClient = buildClient();
            try {
                TrexPicBinResponseJson picBin = webClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .path(binPath)
                                .queryParam("oid", bridgeOid)
                                .queryParam("kuvaId", picId)
                                .build())
                        .retrieve()
                        .bodyToMono(TrexPicBinResponseJson.class)
                        .block();
                logger.debug("picBin: " + picBin);
                return bridgeBin;
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
