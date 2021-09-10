package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.CrossingInputModel;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.repositories.CrossingRepository;
import fi.vaylavirasto.sillari.repositories.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrossingService {
    @Autowired
    CrossingRepository crossingRepository;
    @Autowired
    FileRepository fileRepository;

    public CrossingModel getCrossing(Integer crossingId) {
        CrossingModel crossingModel = crossingRepository.getCrossingById(crossingId);
        if (crossingModel != null) {
            crossingModel.setImages(fileRepository.getFiles(crossingId));
        }
        return crossingModel;
    }

    public CrossingModel getCrossingOfRouteBridge(Integer routeBridgeId) {
        CrossingModel crossingModel = crossingRepository.getCrossingByRouteBridgeId(routeBridgeId);
        if (crossingModel != null) {
            crossingModel.setImages(fileRepository.getFiles(crossingModel.getId()));
        }
        return crossingModel;
    }

    public CrossingModel createCrossing(Integer routeBridgeId) {
        CrossingModel crossingModel = crossingRepository.getCrossingByRouteBridgeId(routeBridgeId);
        if (crossingModel != null) {
            crossingModel.setImages(fileRepository.getFiles(crossingModel.getId()));
            return crossingModel;
        }
        return getCrossing(crossingRepository.createCrossing(routeBridgeId));
    }

    public CrossingModel updateCrossing(CrossingInputModel crossingInputModel) {
        return getCrossing(crossingRepository.updateCrossing(crossingInputModel));
    }
}
