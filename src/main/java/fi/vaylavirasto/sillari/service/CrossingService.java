package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.CrossingInputModel;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.repositories.CrossingRepository;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrossingService {
    @Autowired
    CrossingRepository crossingRepository;
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    PermitRepository permitRepository;

    public CrossingModel createCrossing(Integer routeId, Integer bridgeId) {
        CrossingModel crossingModel = crossingRepository.getCrossing(routeId, bridgeId);
        if(crossingModel != null) {
            return getCrossing(crossingModel.getId(),true);
        }
        return getCrossing(crossingRepository.createCrossing(routeId,bridgeId), true);
    }
    public CrossingModel updateCrossing(CrossingInputModel crossingInputModel) {
        return getCrossing(crossingRepository.updateCrossing(crossingInputModel), crossingInputModel.isDraft());
    }
    public CrossingModel getCrossing(Integer crossingId, Boolean draft) {
        CrossingModel crossingModel = crossingRepository.getCrossing(crossingId, draft);
        RouteModel routeModel = routeRepository.getRoute(Long.valueOf(crossingModel.getRoute().getId()).intValue());
        crossingModel.setRoute(routeModel);
        PermitModel permitModel = permitRepository.getPermit(Long.valueOf(routeModel.getPermitId()).intValue());
        crossingModel.setPermit(permitModel);
        crossingModel.setImages(crossingRepository.getFiles(crossingId));
        return crossingModel;
    }
}
