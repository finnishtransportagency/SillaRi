package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionReportModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusModel;
import fi.vaylavirasto.sillari.repositories.FileRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionStatusRepository;
import fi.vaylavirasto.sillari.repositories.SupervisorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupervisionService {
    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;
    @Autowired
    SupervisorRepository supervisorRepository;
    @Autowired
    FileRepository fileRepository;

    public SupervisionModel getSupervision(Integer supervisionId) {
        SupervisionModel supervisionModel = supervisionRepository.getSupervisionById(supervisionId);
        if (supervisionModel != null) {
            supervisionModel.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervisionId));
            supervisionModel.setImages(fileRepository.getFiles(supervisionId));

            List<SupervisionStatusModel> statusHistory = supervisionStatusRepository.getSupervisionStatusHistory(supervisionId);
            supervisionModel.setStatusHistory(statusHistory);
            supervisionModel.setStatusTimes(statusHistory);
        }
        return supervisionModel;
    }

    public SupervisionModel getSupervisionOfRouteBridge(Integer routeBridgeId) {
        SupervisionModel supervisionModel = supervisionRepository.getSupervisionByRouteBridgeId(routeBridgeId);
        if (supervisionModel != null && supervisionModel.getId() != null) {
            supervisionModel.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervisionId));
            supervisionModel.setImages(fileRepository.getFiles(supervisionModel.getId()));

            List<SupervisionStatusModel> statusHistory = supervisionStatusRepository.getSupervisionStatusHistory(supervisionModel.getId());
            supervisionModel.setStatusHistory(statusHistory);
            supervisionModel.setStatusTimes(statusHistory);
        }
        return supervisionModel;
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
    public SupervisionModel startSupervision(Integer supervisionId) {
        supervisionRepository.createSupervisionReport(supervisionId);
        return getSupervision(supervisionId);
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

    // Updates the report fields
    // TODO do we need to add a new status row?
    public SupervisionModel updateSupervisionReport(SupervisionReportModel supervisionReportModel) {
        supervisionRepository.updateSupervisionReport(supervisionReportModel);
        return getSupervision(supervisionReportModel.getSupervisionId());
    }

}
