package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import fi.vaylavirasto.sillari.repositories.CrossingRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteService {
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    BridgeRepository bridgeRepository;

    public RouteModel getRoute(Integer routeId) {
        RouteModel routeModel;
        routeModel = routeRepository.getRoute(routeId);
        List<BridgeModel> bridgeModels = bridgeRepository.getRoutesBridges(routeId);
        routeModel.setBridges(bridgeModels);
        return routeModel;
    }
}
