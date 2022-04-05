package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import fi.vaylavirasto.sillari.service.fim.FIMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    @Autowired
    RouteTransportPasswordRepository routeTransportPasswordRepository;
    @Autowired
    FIMService fimService;


    public RouteTransportModel getRouteTransport(Integer routeTransportId, boolean includePassword) {
        RouteTransportModel routeTransportModel = routeTransportRepository.getRouteTransportById(routeTransportId);

        if (routeTransportModel != null) {
            routeTransportModel.setRoute(routeRepository.getRoute(routeTransportModel.getRouteId()));
            // Sets also current status
            routeTransportModel.setStatusHistory(routeTransportStatusRepository.getTransportStatusHistory(routeTransportModel.getId()));

            List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteTransportId(routeTransportId);
            if (supervisions != null) {
                supervisions.forEach(supervision -> {
                    supervision.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervision.getId()));
                    fimService.populateSupervisorNamesFromFIM(supervision.getSupervisors());
                    supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
                });
            }
            routeTransportModel.setSupervisions(supervisions);

            if (includePassword) {
                // Only for use with the transport company admin UI
                routeTransportModel.setCurrentTransportPassword(routeTransportPasswordRepository.getTransportPassword(routeTransportModel.getId()));
            }
        }

        return routeTransportModel;
    }

    public RouteTransportModel getRouteTransport(Integer routeTransportId, boolean includePassword, boolean includeSupervisions) {
        RouteTransportModel routeTransportModel = routeTransportRepository.getRouteTransportById(routeTransportId);

        if (routeTransportModel != null) {
            routeTransportModel.setRoute(routeRepository.getRoute(routeTransportModel.getRouteId()));
            // Sets also current status
            routeTransportModel.setStatusHistory(routeTransportStatusRepository.getTransportStatusHistory(routeTransportModel.getId()));

            if (includeSupervisions) {

                List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteTransportId(routeTransportId);
                if (supervisions != null) {
                    supervisions.forEach(supervision -> {
                        supervision.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervision.getId()));
                        // Supervisor name not shown in ui from this resource, so we don't waste time getting them
                        //fimService.populateSupervisorNamesFromFIM(supervision.getSupervisors());
                        supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
                    });
                }
                routeTransportModel.setSupervisions(supervisions);
            }

            if (includePassword) {
                // Only for use with the transport company admin UI
                routeTransportModel.setCurrentTransportPassword(routeTransportPasswordRepository.getTransportPassword(routeTransportModel.getId()));
            }
        }
        return routeTransportModel;
    }

    public List<RouteTransportModel> getRouteTransportsOfPermit(Integer permitId, boolean includePassword) {
        List<RouteTransportModel> routeTransportModels = routeTransportRepository.getRouteTransportsByPermitId(permitId);

        if (routeTransportModels != null) {
            routeTransportModels.forEach(routeTransportModel -> {
                routeTransportModel.setRoute(routeRepository.getRoute(routeTransportModel.getRouteId()));
                // Sets also current status
                routeTransportModel.setStatusHistory(routeTransportStatusRepository.getTransportStatusHistory(routeTransportModel.getId()));

                List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteTransportId(routeTransportModel.getId());
                if (supervisions != null) {
                    supervisions.forEach(supervision -> {
                        supervision.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervision.getId()));
                        // Supervisor name not shown in ui from this resource, so we don't waste time getting them
                        //fimService.populateSupervisorNamesFromFIM(supervision.getSupervisors());
                        supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
                    });
                }
                routeTransportModel.setSupervisions(supervisions);

                if (includePassword) {
                    // Only for use with the transport company admin UI
                    routeTransportModel.setCurrentTransportPassword(routeTransportPasswordRepository.getTransportPassword(routeTransportModel.getId()));
                }
            });
        }

        return routeTransportModels;
    }

    public List<RouteTransportModel> getRouteTransportsOfPermit2(Integer permitId, boolean includePassword) {
        List<RouteTransportModel> routeTransportModels = routeTransportRepository.getRouteTransportsByPermitId(permitId);

        if (routeTransportModels != null) {

            List<RouteModel> routeModels = routeRepository.getRoutesById(
                routeTransportModels.stream().map(RouteTransportModel::getRouteId).distinct().collect(Collectors.toList())
            );

            List<RouteTransportStatusModel> rtStatusModels = routeTransportStatusRepository.getTransportStatusHistory(
                routeTransportModels.stream().map(RouteTransportModel::getId).collect(Collectors.toList())
            );

            List<SupervisionModel> supervisionModels = supervisionRepository.getSupervisionsByRouteTransportId(
                routeTransportModels.stream().map(RouteTransportModel::getId).collect(Collectors.toList())
            );

            routeTransportModels.forEach(rtm -> {

                rtm.setRoute(
                    routeModels.stream().filter(rm -> rtm.getRouteId().equals(rm.getId())).findFirst().orElse(null)
                );

                rtm.setStatusHistory(
                    rtStatusModels.stream().filter(rtsm -> rtm.getId().equals(rtsm.getRouteTransportId())).collect(Collectors.toList())
                );

                List<SupervisionModel> supervisions =
                    supervisionModels.stream().filter(sm -> rtm.getId().equals(sm.getRouteTransportId())).collect(Collectors.toList());

                if (supervisions != null) {

                    Map<Integer, List<SupervisorModel>> supervisorModels = supervisorRepository.getSupervisorsBySupervisionId(
                        supervisionModels.stream().map(SupervisionModel::getId).collect(Collectors.toList())
                    );

                    Map<Integer, List<SupervisionStatusModel>> supervisionStatusModels = supervisionStatusRepository.getSupervisionStatusHistories(
                        supervisionModels.stream().map(SupervisionModel::getId).collect(Collectors.toList())
                    );

                    supervisions.forEach(supervision -> {

                        supervision.setSupervisors(supervisorModels.get(supervision.getId()));

                        // Supervisor name not shown in ui from this resource, so we don't waste time getting them
                        //fimService.populateSupervisorNamesFromFIM(supervision.getSupervisors());

                        supervision.setStatusHistory(supervisionStatusModels.get(supervision.getId()));
                    });
                }
                rtm.setSupervisions(supervisions);

                if (includePassword) {
                    // Only for use with the transport company admin UI
                    rtm.setCurrentTransportPassword(routeTransportPasswordRepository.getTransportPassword(rtm.getId()));
                }
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
                    supervision.setSupervisors(supervisorRepository.getSupervisorsBySupervisionId(supervision.getId()));

                    // Supervisor name not shown in ui from this resource, so we don't waste time getting them
                    //fimService.populateSupervisorNamesFromFIM(supervision.getSupervisors());

                    // Sets also current status and status timestamps
                    supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
                });
            }
            routeTransport.setSupervisions(supervisions);
        }
        return routeTransport;
    }

    public RouteTransportModel createRouteTransport(RouteTransportModel routeTransportModel) {
        // Generate a password and get a new expiry date when creating a new transport
        Integer routeTransportId = routeTransportRepository.createRouteTransport(routeTransportModel,
                routeTransportPasswordRepository.generateUniqueTransportPassword());

        return getRouteTransport(routeTransportId, false);
    }

    public RouteTransportModel updateRouteTransport(RouteTransportModel routeTransportModel) {
        RouteTransportPasswordModel existingPassword = routeTransportPasswordRepository.getTransportPassword(routeTransportModel.getId());

        if (existingPassword != null) {
            // In the usual case when updating a transport, keep the same password but use a new expiry date
            routeTransportRepository.updateRouteTransport(routeTransportModel);
        } else {
            // Just in case a password wasn't created before, generate one now
            // This shouldn't happen if the transport was added via the SillaRi UI
            routeTransportRepository.updateRouteTransportAndInsertPassword(routeTransportModel,
                    routeTransportPasswordRepository.generateUniqueTransportPassword());
        }

        return getRouteTransport(routeTransportModel.getId(), false);
    }

    public void deleteRouteTransport(RouteTransportModel routeTransportModel) {
        routeTransportRepository.deleteRouteTransport(routeTransportModel);
    }

    public void addRouteTransportStatus(RouteTransportStatusModel routeTransportStatusModel) {
        if (routeTransportStatusModel != null) {
            routeTransportStatusRepository.insertTransportStatus(routeTransportStatusModel.getRouteTransportId(), routeTransportStatusModel.getStatus());
        }
    }

    public Integer getMaxUsedTransportNumberOfRoute(Integer routeId) {
        List<RouteTransportModel> routeTransportModels = routeTransportRepository.getRouteTransportsByRouteId(routeId);
        RouteTransportModel routeTransportModel = routeTransportModels.stream().max(Comparator.comparing(RouteTransportModel::getTransportNumber)).orElse(null);
        if (routeTransportModel != null) {
            return routeTransportModel.getTransportNumber();
        } else {
            return 0;
        }
    }
}
