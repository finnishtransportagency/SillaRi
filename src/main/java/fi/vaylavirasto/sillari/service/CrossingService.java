package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.CrossingInputModel;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.repositories.CrossingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrossingService {
    @Autowired
    CrossingRepository crossingRepository;

    public CrossingModel createCrossing(Integer routeId, Integer bridgeId) {
        return crossingRepository.createCrossing(routeId,bridgeId);
    }
    public CrossingModel updateCrossing(CrossingInputModel crossingInputModel) {
        return crossingRepository.updateCrossing(crossingInputModel);
    }
}
