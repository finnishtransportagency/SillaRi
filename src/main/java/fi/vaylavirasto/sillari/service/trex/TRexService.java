package fi.vaylavirasto.sillari.service.trex;

import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJson;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class TRexService {
    private static final Logger logger = LogManager.getLogger();

    @Value("${sillari.trex.url}")
    private String trexUrl;

    public TrexBridgeInfoResponseJson getBridgeInfo(String bridgeOid) {

        logger.trace("bridgeOid: " + bridgeOid);

        if (bridgeOid != null) {
            WebClient webClient = buildClient();
            try {
                TrexBridgeInfoResponseJson bridgeInfo = webClient.get()
                        .retrieve()
                        .bodyToMono(TrexBridgeInfoResponseJson.class)
                        .block();

                return bridgeInfo;
            } catch (HttpStatusCodeException e) {
                logger.error(e.getMessage() + e.getStatusCode());
                return null;
            }

        } else {
            return null;
        }
    }

    private WebClient buildClient() {
        return WebClient.create(trexUrl);
    }
}
