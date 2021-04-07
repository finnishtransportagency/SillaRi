package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.CrossingInputModel;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.repositories.CrossingRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrossingService {
    @Autowired
    CrossingRepository crossingRepository;
    @Autowired
    RouteRepository routeRepository;

    public CrossingModel createCrossing(Integer routeId, Integer bridgeId) {
        return getCrossing(crossingRepository.createCrossing(routeId,bridgeId));
    }
    public CrossingModel updateCrossing(CrossingInputModel crossingInputModel) {
        return getCrossing(crossingRepository.updateCrossing(crossingInputModel));
    }
    public CrossingModel getCrossing(Integer crossingId) {
        CrossingModel crossingModel = crossingRepository.getCrossing(crossingId);
        RouteModel routeModel = routeRepository.getRoute(Long.valueOf(crossingModel.getRoute().getId()).intValue());
        crossingModel.setRoute(routeModel);
        return crossingModel;
    }
}
