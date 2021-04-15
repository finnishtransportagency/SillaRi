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

    public CrossingModel getCrossing(Integer crossingId) {
        CrossingModel crossingModel = crossingRepository.getCrossingById(crossingId);
        if (crossingModel != null) {
            crossingModel.setImages(crossingRepository.getFiles(crossingId));
        }
        return crossingModel;
    }

    public CrossingModel createCrossing(Integer routeBridgeId) {
        CrossingModel crossingModel = crossingRepository.getCrossingByRouteBridgeId(routeBridgeId);
        if (crossingModel != null) {
            crossingModel.setImages(crossingRepository.getFiles(crossingModel.getId()));
            return crossingModel;
        }
        return getCrossing(crossingRepository.createCrossing(routeBridgeId));
    }

    public CrossingModel updateCrossing(CrossingInputModel crossingInputModel) {
        return getCrossing(crossingRepository.updateCrossing(crossingInputModel));
    }
}
