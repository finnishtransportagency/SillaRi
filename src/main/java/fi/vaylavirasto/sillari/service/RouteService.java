package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    RouteBridgeRepository routeBridgeRepository;
    @Autowired
    BridgeRepository bridgeRepository;
    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;

    public RouteModel getRoute(Integer routeId) {
        RouteModel routeModel = routeRepository.getRoute(routeId);

        if (routeModel != null) {
            String routeGeoJson = routeRepository.getRouteGeoJson(routeId);
            routeModel.setGeojson(routeGeoJson);

            List<RouteBridgeModel> routeBridgeModels = routeBridgeRepository.getRouteBridges(routeId);
            if (routeBridgeModels != null) {
                routeBridgeModels.forEach(routeBridgeModel -> {
                    String bridgeGeoJson = bridgeRepository.getBridgeGeoJson(routeBridgeModel.getBridge().getId());
                    routeBridgeModel.getBridge().setGeojson(bridgeGeoJson);

                    SupervisionModel supervision = supervisionRepository.getSupervisionByRouteBridgeId(routeBridgeModel.getId());
                    if (supervision != null) {
                        // Sets also current status and status timestamps
                        supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
                        routeBridgeModel.setSupervision(supervision);
                    }
                });
            }
            routeModel.setRouteBridges(routeBridgeModels);
        }
        return routeModel;
    }
}
