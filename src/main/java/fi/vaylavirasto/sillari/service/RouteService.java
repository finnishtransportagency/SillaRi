package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.model.RouteModel;
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
    CrossingRepository crossingRepository;

    public RouteModel getRoute(Integer id) {
        RouteModel routeModel;
        routeModel = routeRepository.getRoute(id);
        List<CrossingModel> crossingModels = crossingRepository.getRoutesCrossings(Long.valueOf(routeModel.getId()).intValue());
        routeModel.setCrossings(crossingModels);
        return routeModel;
    }
}
