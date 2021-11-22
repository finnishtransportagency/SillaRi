package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.*;
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
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    PermitRepository permitRepository;

    public SupervisionModel getSupervision(Integer supervisionId) {
        SupervisionModel supervision = supervisionRepository.getSupervisionById(supervisionId);
        if (supervision != null) {
            fillSupervisionDetails(supervision);
            fillPermitDetails(supervision);
        }
        return supervision;
    }

    private void fillSupervisionDetails(SupervisionModel supervision) {
        Integer supervisionId = supervision.getId();
        supervision.setReport(supervisionReportRepository.getSupervisionReport(supervisionId));
        supervision.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervisionId));
        supervision.setImages(supervisionImageRepository.getFiles(supervisionId));
        // Sets also current status and status timestamps
        supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervisionId));
    }

    private void fillPermitDetails(SupervisionModel supervision) {
        RouteBridgeModel routeBridge = supervision.getRouteBridge();
        if (routeBridge != null) {
            RouteModel route = routeRepository.getRoute(supervision.getRouteBridge().getRouteId());
            routeBridge.setRoute(route);
            if (route != null) {
                route.setPermit(permitRepository.getPermit(route.getPermitId()));
            }
        }
    }

    public List<SupervisionModel> getSupervisionsOfSupervisor(String username) {
        List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsBySupervisorUsername(username);
        for (SupervisionModel supervision : supervisions) {
            // Sets also current status and status timestamps
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
        }
        return supervisions;
    }

    public List<SupervisionModel> getFinishedButUnsignedSupervisions(String username) {
        List<SupervisionModel> supervisions = supervisionRepository.getFinishedButUnsignedSupervisionsBySupervisorUsername(username);
        for (SupervisionModel supervision : supervisions) {
            // The sending list needs supervision started time, bridge and permit details
            supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
            fillPermitDetails(supervision);
        }
        return supervisions;
    }

    public List<SupervisorModel> getSupervisors() {
        // TODO - limit the list of supervisors somehow?
        return supervisorRepository.getSupervisors();
    }

    // Creates new supervision and adds a new status with type PLANNED
    // The timestamp in PLANNED is the current time, not planned_time which can be updated later.
    public void createSupervision(SupervisionModel supervisionModel) {
        supervisionRepository.createSupervision(supervisionModel);
    }

    // Updates supervision fields (supervisors, planned time)
    public void updateSupervision(SupervisionModel supervisionModel) {
        supervisionRepository.updateSupervision(supervisionModel);
    }

    public SupervisionModel updateConformsToPermit(Integer supervisionId, Boolean conformsToPermit) {
        supervisionRepository.updateSupervision(supervisionId, conformsToPermit);
        return getSupervision(supervisionId);
    }

    public void deleteSupervision(SupervisionModel supervisionModel) {
        supervisionRepository.deleteSupervision(supervisionModel);
    }

    // Adds the status IN_PROGRESS and creates a new supervision report
    public SupervisionModel startSupervision(SupervisionReportModel report) {
        supervisionReportRepository.createSupervisionReport(report);
        return getSupervision(report.getSupervisionId());
    }

    // Ends the supervision by adding the status CROSSING_DENIED
    public SupervisionModel denyCrossing(SupervisionModel supervisionModel) {
        supervisionRepository.updateSupervision(supervisionModel.getId(), supervisionModel.getDenyCrossingReason());
        return getSupervision(supervisionModel.getId());
    }

    // Ends the supervision by adding the status FINISHED
    public SupervisionModel finishSupervision(Integer supervisionId) {
        supervisionStatusRepository.insertSupervisionStatus(supervisionId, SupervisionStatusType.FINISHED);
        return getSupervision(supervisionId);
    }

    // Completes the supervision by adding the status REPORT_SIGNED
    public SupervisionModel completeSupervision(Integer supervisionId) {
        supervisionStatusRepository.insertSupervisionStatus(supervisionId, SupervisionStatusType.REPORT_SIGNED);
        return getSupervision(supervisionId);
    }

    // Deletes the report and adds the status CANCELLED
    public SupervisionModel cancelSupervision(Integer supervisionId) {
        supervisionReportRepository.deleteSupervisionReport(supervisionId);
        return getSupervision(supervisionId);
    }

    // Updates the report fields
    public SupervisionModel updateSupervisionReport(SupervisionReportModel supervisionReportModel) {
        supervisionReportRepository.updateSupervisionReport(supervisionReportModel);
        return getSupervision(supervisionReportModel.getSupervisionId());
    }

}
