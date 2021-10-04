package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BridgeService {
    @Autowired
    BridgeRepository bridgeRepository;
    @Autowired
    RouteBridgeRepository routeBridgeRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;

    public BridgeModel getBridge(Integer bridgeId) {
        BridgeModel bridgeModel = bridgeRepository.getBridge(bridgeId);
        if (bridgeModel != null) {
            String bridgeGeoJson = bridgeRepository.getBridgeGeoJson(bridgeId);
            bridgeModel.setGeojson(bridgeGeoJson);
        }
        return bridgeModel;
    }

    public List<BridgeModel> getBridgesOfSupervisor(Integer supervisorId) {
        List<BridgeModel> bridges = bridgeRepository.getBridgesOfSupervisor(supervisorId);
        for (BridgeModel bridge : bridges) {
            List<RouteBridgeModel> routeBridges = routeBridgeRepository.getRouteBridgesOfBridge(bridge.getId());
            bridge.setRouteBridges(routeBridges);

            for (RouteBridgeModel routeBridge : routeBridges) {
                SupervisionModel supervision = routeBridge.getSupervision();
                if (supervision != null) {
                    // Sets also current status and main status timestamps
                    supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
                }
            }
        }
        return bridges;
    }

}
