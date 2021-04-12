package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteBridgeService {
    @Autowired
    RouteBridgeRepository routeBridgeRepository;

    public BridgeModel getRouteBridge(Integer id) {
        BridgeModel bridgeModel;
        bridgeModel = routeBridgeRepository.getRouteBridge(id);
        return bridgeModel;
    }

}
