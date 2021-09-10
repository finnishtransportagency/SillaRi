package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.FileRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupervisionService {
    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;
    @Autowired
    FileRepository fileRepository;

    public SupervisionModel getSupervision(Integer supervisionId) {
        SupervisionModel supervisionModel = supervisionRepository.getSupervisionById(supervisionId);
        if (supervisionModel != null) {
            supervisionModel.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervisionId));
            supervisionModel.setImages(fileRepository.getFiles(supervisionId));
        }
        return supervisionModel;
    }

    // Returns only the basic details of supervision, not report, images or status history
    public SupervisionModel getSupervisionOfRouteBridge(Integer routeBridgeId) {
        return supervisionRepository.getSupervisionByRouteBridgeId(routeBridgeId);
    }

    // Creates new supervision and adds a new status with type PLANNED
    // The timestamp in PLANNED is the current time, not planned_time which can be updated later.
    public SupervisionModel createSupervision(SupervisionModel supervisionModel) {
        Integer supervisionId = supervisionRepository.createSupervision(supervisionModel);
        return getSupervision(supervisionId);
    }

    // Updates supervision fields (transport, supervisor, planned time, conforms_to_permit)
    // TODO do we need to add a new status row?
    public SupervisionModel updateSupervision(SupervisionModel supervisionModel) {
        supervisionRepository.updateSupervision(supervisionModel);
        return getSupervision(supervisionModel.getId());
    }

    // Adds the status IN_PROGRESS and creates a new supervision report
    public SupervisionModel startSupervision(SupervisionModel supervisionModel) {
        supervisionRepository.createSupervisionReport(supervisionModel);
        return getSupervision(supervisionModel.getId());
    }

    // Updates the report fields
    // TODO do we need to add a new status row?
    public SupervisionModel updateSupervisionReport(SupervisionModel supervisionModel) {
        supervisionRepository.updateSupervisionReport(supervisionModel);
        return getSupervision(supervisionModel.getId());
    }

    // Cancels the supervision by adding the status CANCELLED
    public SupervisionModel cancelSupervision(SupervisionModel supervisionModel) {
        supervisionRepository.cancelSupervision(supervisionModel);
        return getSupervision(supervisionModel.getId());
    }

    // Ends the supervision by adding the status FINISHED
    public SupervisionModel finishSupervision(SupervisionModel supervisionModel) {
        supervisionRepository.finishSupervision(supervisionModel);
        return getSupervision(supervisionModel.getId());
    }

}
