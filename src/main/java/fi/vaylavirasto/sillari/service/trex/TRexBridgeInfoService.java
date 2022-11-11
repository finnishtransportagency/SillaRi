package fi.vaylavirasto.sillari.service.trex;

import fi.vaylavirasto.sillari.api.rest.error.TRexRestException;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJson;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJsonMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
public class TRexBridgeInfoService {
    private static final Logger logger = LogManager.getLogger();

    @Value("${sillari.trex.url}")
    private String trexUrl;
    private final TrexBridgeInfoResponseJsonMapper dtoMapper = Mappers.getMapper(TrexBridgeInfoResponseJsonMapper.class);

    public BridgeModel getBridge(String oid) throws TRexRestException {
        logger.debug("getBridge oid: " + oid);
        TrexBridgeInfoResponseJson bridgeInfo = getBridgeInfo(oid);
        BridgeModel bridgeModel = dtoMapper.fromDTOToModel(bridgeInfo);
        logger.debug("bridgeModel: " + bridgeModel);
        return bridgeModel;
    }

    public TrexBridgeInfoResponseJson getBridgeInfo(String bridgeOid) throws TRexRestException {

        logger.trace("bridgeOid: " + bridgeOid);

        if (bridgeOid != null) {
            WebClient webClient = buildClient();
            try {
                TrexBridgeInfoResponseJson bridgeInfo = webClient.get()
                        .uri(uriBuilder -> uriBuilder

                                .queryParam("oid", bridgeOid)
                                .build())
                        .retrieve()
                        .bodyToMono(TrexBridgeInfoResponseJson.class)
                        .block();
                logger.debug("bridgeInfo: " + bridgeInfo);
                return bridgeInfo;
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
