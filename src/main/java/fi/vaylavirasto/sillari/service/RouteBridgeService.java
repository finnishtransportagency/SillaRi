package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteBridgeService {
    @Autowired
    RouteBridgeRepository routeBridgeRepository;
    @Autowired
    BridgeRepository bridgeRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;

    public RouteBridgeModel getRouteBridge(Integer id) {
        RouteBridgeModel routeBridgeModel = routeBridgeRepository.getRouteBridge(id);
        if (routeBridgeModel != null && routeBridgeModel.getBridge() != null) {
            String bridgeGeoJson = bridgeRepository.getBridgeGeoJson(routeBridgeModel.getBridge().getId());
            routeBridgeModel.getBridge().setGeojson(bridgeGeoJson);

            SupervisionModel supervision = routeBridgeModel.getSupervision();
            if (supervision != null) {
                // Sets also current status and status timestamps
                supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
            }
        }
        return routeBridgeModel;
    }

    public List<RouteBridgeModel> getRouteBridgesOfSupervisor(Integer supervisorId) {
        List<RouteBridgeModel> routeBridges = routeBridgeRepository.getRouteBridgesOfSupervisor(supervisorId);
        for (RouteBridgeModel routeBridge : routeBridges) {
            SupervisionModel supervision = routeBridge.getSupervision();
            if (supervision != null) {
                supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
            }
        }
        return routeBridges;
    }

}
