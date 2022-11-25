package fi.vaylavirasto.sillari.service.trex;

import fi.vaylavirasto.sillari.api.rest.error.TRexRestException;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJson;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJsonMapper;
import lombok.extern.slf4j.Slf4j;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Slf4j
@Service
public class TRexBridgeInfoService {
    @Value("${sillari.trex.url}")
    private String trexUrl;
    private final TrexBridgeInfoResponseJsonMapper dtoMapper = Mappers.getMapper(TrexBridgeInfoResponseJsonMapper.class);

    public BridgeModel getBridge(String oid) throws TRexRestException {
        log.debug("getBridge oid: " + oid);
        TrexBridgeInfoResponseJson bridgeInfo = getBridgeInfo(oid);
        BridgeModel bridgeModel = dtoMapper.fromDTOToModel(bridgeInfo);
        log.debug("bridgeModel: " + bridgeModel);
        return bridgeModel;
    }

    public TrexBridgeInfoResponseJson getBridgeInfo(String bridgeOid) throws TRexRestException {

        log.trace("bridgeOid: " + bridgeOid);

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
                log.debug("bridgeInfo: " + bridgeInfo);
                return bridgeInfo;
            } catch (WebClientResponseException e) {
                log.error(e.getMessage() + e.getStatusCode());
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
