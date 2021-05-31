package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
import fi.vaylavirasto.sillari.repositories.RouteTransportRepository;
import fi.vaylavirasto.sillari.repositories.RouteTransportStatusRepository;
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
    RouteTransportRepository routeTransportRepository;
    @Autowired
    RouteTransportStatusRepository routeTransportStatusRepository;

    public RouteModel getRoute(Integer routeId) {
        RouteModel routeModel;
        routeModel = routeRepository.getRoute(routeId);
        List<RouteBridgeModel> routeBridgeModels = routeBridgeRepository.getRoutesBridges(routeId);
        routeModel.setRouteBridges(routeBridgeModels);

        // TODO remove test
        RouteTransportModel transportModel = routeTransportRepository.getRouteTransportByRouteId(routeId);
        transportModel.setStatusHistory(routeTransportStatusRepository.getTransportStatusHistory((int) transportModel.getId()));
        return routeModel;
    }
}
