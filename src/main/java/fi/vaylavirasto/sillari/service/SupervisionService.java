package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionReportModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import fi.vaylavirasto.sillari.model.SupervisorModel;
import fi.vaylavirasto.sillari.repositories.*;
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
    SupervisionReportRepository supervisionReportRepository;
    @Autowired
    SupervisorRepository supervisorRepository;
    @Autowired
    SupervisionImageRepository supervisionImageRepository;

    public SupervisionModel getSupervision(Integer supervisionId) {
        SupervisionModel supervision = supervisionRepository.getSupervisionById(supervisionId);
        if (supervision != null) {
            supervision.setReport(supervisionReportRepository.getSupervisionReport(supervisionId));
            supervision.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervisionId));
            supervision.setImages(supervisionImageRepository.getFiles(supervisionId));

            // Sets also current status and status timestamps
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervisionId));
        }
        return supervision;
    }

    public SupervisionModel getSupervisionOfRouteBridge(Integer routeBridgeId) {
        List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteBridgeId(routeBridgeId);
        SupervisionModel supervision = null;
        if (supervisions != null) {
            // TODO this is a quick fix to solve TooManyRowsException, to be refactored later
            supervision = supervisions.get(0);
            supervision.setReport(supervisionReportRepository.getSupervisionReport(supervision.getId()));
            supervision.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervision.getId()));
            supervision.setImages(supervisionImageRepository.getFiles(supervision.getId()));

            // Sets also current status and status timestamps
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
        }
        return supervision;
    }


    public List<SupervisionModel> getSupervisionsOfSupervisor(String username) {
        List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsBySupervisorUsername(username);
        for (SupervisionModel supervision : supervisions) {
            // Sets also current status and status timestamps
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
        }
        return supervisions;
    }

    public List<SupervisorModel> getSupervisors() {
        // TODO - limit the list of supervisors somehow?
        return supervisorRepository.getSupervisors();
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
        supervisionReportRepository.createSupervisionReport(supervisionId);
        return getSupervision(supervisionId);
    }

    // Cancels the supervision by adding the status CANCELLED
    public SupervisionModel cancelSupervision(SupervisionModel supervisionModel) {
        supervisionStatusRepository.insertSupervisionStatus(supervisionModel.getId(), SupervisionStatusType.CANCELLED);
        return getSupervision(supervisionModel.getId());
    }

    // Ends the supervision by adding the status FINISHED
    public SupervisionModel finishSupervision(SupervisionModel supervisionModel) {
        supervisionStatusRepository.insertSupervisionStatus(supervisionModel.getId(), SupervisionStatusType.FINISHED);
        return getSupervision(supervisionModel.getId());
    }

    // Updates the report fields
    // TODO do we need to add a new status row?
    public SupervisionModel updateSupervisionReport(SupervisionReportModel supervisionReportModel) {
        supervisionReportRepository.updateSupervisionReport(supervisionReportModel);
        return getSupervision(supervisionReportModel.getSupervisionId());
    }

}
