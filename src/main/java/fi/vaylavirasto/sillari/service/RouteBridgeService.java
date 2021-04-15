package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.repositories.CrossingRepository;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteBridgeService {
    @Autowired
    RouteBridgeRepository routeBridgeRepository;

    @Autowired
    CrossingRepository crossingRepository;

    public RouteBridgeModel getRouteBridge(Integer id) {
        return routeBridgeRepository.getRouteBridge(id);
    }

    public CrossingModel getRouteBridgeCrossing(Integer routeBridgeId) {
        CrossingModel crossingModel = crossingRepository.getCrossingByRouteBridgeId(routeBridgeId);
        if (crossingModel != null) {
            crossingModel.setImages(crossingRepository.getFiles(crossingModel.getId()));
        }
        return crossingModel;
    }

}
