package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
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
                });
            }
            routeModel.setRouteBridges(routeBridgeModels);
        }
        return routeModel;
    }
}
