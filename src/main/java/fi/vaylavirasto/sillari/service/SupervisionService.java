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
    // TODO do we need to add a new status row?
    public void updateSupervision(SupervisionModel supervisionModel) {
        supervisionRepository.updateSupervision(supervisionModel);
    }

    public SupervisionModel updateConformsToPermit(Integer supervisionId, Boolean conformsToPermit) {
        supervisionRepository.updateSupervision(supervisionId, conformsToPermit);
        return getSupervision(supervisionId);
    }

    // Adds the status IN_PROGRESS and creates a new supervision report
    public SupervisionModel startSupervision(Integer supervisionId) {
        supervisionReportRepository.createSupervisionReport(supervisionId);
        return getSupervision(supervisionId);
    }

    // Cancels the supervision by adding the status CANCELLED
    // TODO change CANCELLED to CROSSING_DENIED and save deny reason somewhere (to supervision?)
    public SupervisionModel denyCrossing(SupervisionModel supervisionModel) {
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
