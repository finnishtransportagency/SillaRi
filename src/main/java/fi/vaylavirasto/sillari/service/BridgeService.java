package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.dto.CoordinatesDTO;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class BridgeService {
    @Autowired
    BridgeRepository bridgeRepository;

    public Integer createOrUpdateBridge(BridgeModel bridge) {
        Integer bridgeId;
        BridgeModel oldBridge = bridgeRepository.getBridge(bridge.getOid());
        if (oldBridge != null) {
            bridge.setId(oldBridge.getId());
            bridgeRepository.updateBridge(bridge);
            bridgeId = bridge.getId();
            log.debug("updatedBridge");
        } else {
            bridgeId = bridgeRepository.createBridge(bridge);
            log.debug("createdBridge");
        }
        return bridgeId;
    }

    public CoordinatesDTO getBridgeCoordinates(Integer bridgeId) {
        CoordinatesDTO coords = bridgeRepository.getBridgeCoordinates(bridgeId);
        if (coords.getX() != null && coords.getY() != null) {
            return coords;
        }
        return null;
    }
}