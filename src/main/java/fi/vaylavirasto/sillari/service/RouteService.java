package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusModel;
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
        RouteModel route = routeRepository.getRoute(routeId);

        if (route != null) {
            String routeGeoJson = routeRepository.getRouteGeoJson(routeId);
            route.setGeojson(routeGeoJson);

            List<RouteBridgeModel> routeBridges = routeBridgeRepository.getRouteBridges(routeId);
            if (routeBridges != null) {
                routeBridges.forEach(routeBridge -> {
                    String bridgeGeoJson = bridgeRepository.getBridgeGeoJson(routeBridge.getBridge().getId());
                    routeBridge.getBridge().setGeojson(bridgeGeoJson);

                    List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteBridgeId(routeBridge.getId());
                    if (supervisions != null) {
                        // TODO this is a quick fix to solve TooManyRowsException, to be refactored later
                        SupervisionModel supervision = supervisions.get(0);
                        List<SupervisionStatusModel> statusHistory = supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId());
                        supervision.setStatusHistory(statusHistory);
                        routeBridge.setSupervision(supervision);
                    }

                });
            }
            route.setRouteBridges(routeBridges);
        }
        return route;
    }
}
