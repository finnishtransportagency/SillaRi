package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteBridgeService {
    @Autowired
    RouteBridgeRepository routeBridgeRepository;
    @Autowired
    BridgeRepository bridgeRepository;
    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;

    public RouteBridgeModel getRouteBridge(Integer id) {
        RouteBridgeModel routeBridgeModel = routeBridgeRepository.getRouteBridge(id);
        if (routeBridgeModel != null && routeBridgeModel.getBridge() != null) {
            String bridgeGeoJson = bridgeRepository.getBridgeGeoJson(routeBridgeModel.getBridge().getId());
            routeBridgeModel.getBridge().setGeojson(bridgeGeoJson);

            SupervisionModel supervision = supervisionRepository.getSupervisionByRouteBridgeId(id);
            if (supervision != null) {
                // Sets also current status and status timestamps
                supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
                routeBridgeModel.setSupervision(supervision);
            }
        }
        return routeBridgeModel;
    }
}
