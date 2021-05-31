package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
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

    public RouteModel getRoute(Integer routeId) {
        RouteModel routeModel;
        routeModel = routeRepository.getRoute(routeId);
        List<RouteBridgeModel> routeBridgeModels = routeBridgeRepository.getRoutesBridges(routeId);
        routeModel.setRouteBridges(routeBridgeModels);
        return routeModel;
    }
}
