package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.RouteTransportStatusModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
import fi.vaylavirasto.sillari.repositories.RouteTransportRepository;
import fi.vaylavirasto.sillari.repositories.RouteTransportStatusRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionRepository;
import fi.vaylavirasto.sillari.repositories.SupervisorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteTransportService {
    @Autowired
    RouteTransportRepository routeTransportRepository;
    @Autowired
    RouteTransportStatusRepository routeTransportStatusRepository;
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    SupervisorRepository supervisorRepository;

    public RouteTransportModel getRouteTransport(Integer routeTransportId) {
        RouteTransportModel routeTransportModel = routeTransportRepository.getRouteTransportById(routeTransportId);

        if (routeTransportModel != null) {
            List<RouteTransportStatusModel> statusHistory = routeTransportStatusRepository.getTransportStatusHistory(routeTransportModel.getId());
            routeTransportModel.setStatusHistory(statusHistory);
            routeTransportModel.setCurrentStatus(statusHistory);
            routeTransportModel.setRoute(routeRepository.getRoute(routeTransportModel.getRouteId()));

            List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteTransportId(routeTransportId);
            if (supervisions != null) {
                supervisions.forEach(supervisionModel -> {
                    supervisionModel.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervisionModel.getId()));
                });
            }
            routeTransportModel.setSupervisions(supervisions);
        }

        return routeTransportModel;
    }

    public List<RouteTransportModel> getRouteTransportsOfPermit(Integer permitId) {
        List<RouteTransportModel> routeTransportModels = routeTransportRepository.getRouteTransportsByPermitId(permitId);

        if (routeTransportModels != null) {
            routeTransportModels.forEach(routeTransportModel -> {
                List<RouteTransportStatusModel> statusHistory = routeTransportStatusRepository.getTransportStatusHistory(routeTransportModel.getId());
                routeTransportModel.setStatusHistory(statusHistory);
                routeTransportModel.setCurrentStatus(statusHistory);
                routeTransportModel.setRoute(routeRepository.getRoute(routeTransportModel.getRouteId()));

                List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteTransportId(routeTransportModel.getId());
                if (supervisions != null) {
                    supervisions.forEach(supervisionModel -> {
                        supervisionModel.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervisionModel.getId()));
                    });
                }
                routeTransportModel.setSupervisions(supervisions);
            });
        }

        return routeTransportModels;
    }
}
