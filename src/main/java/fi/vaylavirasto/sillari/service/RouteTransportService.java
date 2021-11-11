package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.RouteTransportPasswordModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Comparator;
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
    @Autowired
    RouteTransportPasswordRepository routeTransportPasswordRepository;

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
                    // Sets also current status and status timestamps
                    supervision.setStatusHistory(supervisionStatusRepository.getSupervisionStatusHistory(supervision.getId()));
                });
            }
            routeTransport.setSupervisions(supervisions);
        }
        return routeTransport;
    }

    private OffsetDateTime getPasswordExpiryDate(RouteTransportModel routeTransportModel) {
        // Get the planned date of the last supervision to use for the password expiry date, but only if it's later than now
        OffsetDateTime passwordExpiryDate = OffsetDateTime.now();
        if (routeTransportModel.getSupervisions() != null && !routeTransportModel.getSupervisions().isEmpty()) {
            SupervisionModel lastSupervision = routeTransportModel.getSupervisions().stream()
                    .max(Comparator.comparing(SupervisionModel::getPlannedTime)).orElse(null);

            if (lastSupervision != null) {
                OffsetDateTime maxPlannedTime = lastSupervision.getPlannedTime();

                if (maxPlannedTime != null && maxPlannedTime.isAfter(passwordExpiryDate)) {
                    passwordExpiryDate = maxPlannedTime;
                }
            }
        }

        // Add a 1 day buffer to the expiry date
        passwordExpiryDate = passwordExpiryDate.plusDays(1);

        return passwordExpiryDate;
    }

    public RouteTransportModel createRouteTransport(RouteTransportModel routeTransportModel) {
        // Generate a password and get a new expiry date when creating a new transport
        Integer routeTransportId = routeTransportRepository.createRouteTransport(routeTransportModel,
                routeTransportPasswordRepository.generateUniqueTransportPassword(),
                getPasswordExpiryDate(routeTransportModel));

        return getRouteTransport(routeTransportId, false);
    }

    public RouteTransportModel updateRouteTransport(RouteTransportModel routeTransportModel) {
        RouteTransportPasswordModel existingPassword = routeTransportPasswordRepository.getTransportPassword(routeTransportModel.getId());

        if (existingPassword != null) {
            // In the usual case when updating a transport, keep the same password but use a new expiry date
            routeTransportRepository.updateRouteTransport(routeTransportModel,
                    getPasswordExpiryDate(routeTransportModel));
        } else {
            // Just in case a password wasn't created before, generate one now
            // This shouldn't happen if the transport was added via the SillaRi UI
            routeTransportRepository.updateRouteTransportAndInsertPassword(routeTransportModel,
                    routeTransportPasswordRepository.generateUniqueTransportPassword(),
                    getPasswordExpiryDate(routeTransportModel));
        }

        return getRouteTransport(routeTransportModel.getId(), false);
    }

    public void deleteRouteTransport(RouteTransportModel routeTransportModel) {
        routeTransportRepository.deleteRouteTransport(routeTransportModel);
    }
}
