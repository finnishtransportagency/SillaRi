package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BridgeService {
    @Autowired
    BridgeRepository bridgeRepository;

    public BridgeModel getBridge(Integer id) {
        BridgeModel bridgeModel;
        bridgeModel = bridgeRepository.getBridge(id);
        return bridgeModel;
    }

    public List<BridgeModel> getRoutesBridges(Integer routeId) {
        return bridgeRepository.getRoutesBridges(routeId);
    }
}
