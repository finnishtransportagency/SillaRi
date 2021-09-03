package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.CrossingRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupervisionService {
    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    CrossingRepository crossingRepository;

    public SupervisionModel getSupervision(Integer supervisionId) {
        SupervisionModel supervisionModel = supervisionRepository.getSupervisionById(supervisionId);
        if (supervisionModel != null) {
            supervisionModel.setImages(crossingRepository.getFiles(supervisionId));
        }
        return supervisionModel;
    }

    public SupervisionModel getSupervisionOfRouteBridge(Integer routeBridgeId) {
        // We need only basic details at this point, no need to add image files
        return supervisionRepository.getSupervisionByRouteBridgeId(routeBridgeId);
    }

}
