package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.dto.CoordinatesDTO;
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
        if (oldBridge != null) {
            bridge.setId(oldBridge.getId());
            bridgeRepository.updateBridge(bridge);
            logger.debug("updatedBridge");
        } else {
            bridgeRepository.createBridge(bridge);
            logger.debug("createdBridge");
        }
    }

    public CoordinatesDTO getBridgeCoordinates(Integer bridgeId){
        Double x = Double.valueOf(bridgeRepository.getBridgeXCoord(bridgeId));
        Double y = Double.valueOf(bridgeRepository.getBridgeYCoord(bridgeId));
        return new CoordinatesDTO(x, y);
    }
}