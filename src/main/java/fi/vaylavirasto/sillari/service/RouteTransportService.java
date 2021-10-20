package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.*;
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
    PermitRepository permitRepository;
    @Autowired
    AxleRepository axleRepository;
    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    SupervisionRepository supervisionRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;
    @Autowired
    SupervisorRepository supervisorRepository;

    public RouteTransportModel getRouteTransport(Integer routeTransportId) {
        RouteTransportModel routeTransportModel = routeTransportRepository.getRouteTransportById(routeTransportId);

        if (routeTransportModel != null) {
            routeTransportModel.setRoute(routeRepository.getRoute(routeTransportModel.getRouteId()));
            // Sets also current status
            routeTransportModel.setStatusHistory(routeTransportStatusRepository.getTransportStatusHistory(routeTransportModel.getId()));

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
                routeTransportModel.setRoute(routeRepository.getRoute(routeTransportModel.getRouteId()));
                // Sets also current status
                routeTransportModel.setStatusHistory(routeTransportStatusRepository.getTransportStatusHistory(routeTransportModel.getId()));

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

    public RouteTransportModel getRouteTransportOfSupervisor(Integer routeTransportId, String username) {
        RouteTransportModel routeTransport = routeTransportRepository.getRouteTransportById(routeTransportId);

        if (routeTransport != null) {
            // Sets also current status and status timestamps
            routeTransport.setStatusHistory(routeTransportStatusRepository.getTransportStatusHistory(routeTransport.getId()));

            // Set route details to route transport
            RouteModel route = routeRepository.getRoute(routeTransport.getRouteId());
            routeTransport.setRoute(route);

            // Set permit details to route
            if (route != null) {
                PermitModel permit = permitRepository.getPermit(route.getPermitId());
                route.setPermit(permit);
                if (permit != null) {
                    permit.setVehicles(vehicleRepository.getVehiclesOfPermit(permit.getId()));
                    if (permit.getAxleChart() != null) {
                        permit.getAxleChart().setAxles(axleRepository.getAxlesOfChart(permit.getAxleChart().getId()));
                    }
                }
            }

            // Set supervisions with bridge data to route transport.
            // Not all bridges from route are added, only those where the supervisor has supervisions.
            List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteTransportAndSupervisorUsername(routeTransportId, username);
            if (supervisions != null) {
                supervisions.forEach(supervision -> {
                    // Sets also current status and status timestamps
                    supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
                });
            }
            routeTransport.setSupervisions(supervisions);
        }
        return routeTransport;
    }

    public RouteTransportModel createRouteTransport(RouteTransportModel routeTransportModel) {
        Integer routeTransportId = routeTransportRepository.createRouteTransport(routeTransportModel);
        return getRouteTransport(routeTransportId);
    }

    public RouteTransportModel updateRouteTransport(RouteTransportModel routeTransportModel) {
        routeTransportRepository.updateRouteTransport(routeTransportModel);
        return getRouteTransport(routeTransportModel.getId());
    }
}
