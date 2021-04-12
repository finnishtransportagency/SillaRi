package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteBridgeService {
    @Autowired
    RouteBridgeRepository routeBridgeRepository;

    public BridgeModel getRouteBridge(Integer routeId, Integer bridgeId) {
        BridgeModel bridgeModel;
        bridgeModel = routeBridgeRepository.getRouteBridge(routeId, bridgeId);
        return bridgeModel;
    }

}
