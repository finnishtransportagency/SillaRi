package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BridgeService {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    BridgeRepository bridgeRepository;

    public void createOrUpdateBridge(BridgeModel bridge) {
        BridgeModel oldBridge = bridgeRepository.getBridge(bridge.getOid());
        if(oldBridge != null){
            bridgeRepository.updateBridge(bridge);
            logger.debug("updatedBridge");
        }
        else{
            bridgeRepository.createBridge(bridge);
            logger.debug("createdBridge");
        }
    }
}