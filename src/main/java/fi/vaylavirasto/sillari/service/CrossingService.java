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

    public CrossingModel createCrossing(Integer routeBridgeId) {
        CrossingModel crossingModel = crossingRepository.getCrossing(routeBridgeId);
        if (crossingModel != null) {
            crossingModel.setImages(crossingRepository.getFiles(crossingModel.getId()));
            return crossingModel;
        }
        return getCrossing(crossingRepository.createCrossing(routeBridgeId), true);
    }

    public CrossingModel updateCrossing(CrossingInputModel crossingInputModel) {
        return getCrossing(crossingRepository.updateCrossing(crossingInputModel), crossingInputModel.isDraft());
    }

    public CrossingModel getCrossing(Integer crossingId, Boolean draft) {
        CrossingModel crossingModel = crossingRepository.getCrossing(crossingId, draft);
        if (crossingModel != null) {
            crossingModel.setImages(crossingRepository.getFiles(crossingId));
        }
        return crossingModel;
    }
}
