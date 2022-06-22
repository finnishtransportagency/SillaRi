package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.api.rest.error.TransportNumberConflictException;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RouteTransportService {

    private static final Logger logger = LogManager.getLogger();

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
    RouteTransportPasswordRepository routeTransportPasswordRepository;

    @Autowired
    RouteTransportNumberService routeTransportNumberService;


    public RouteTransportModel getRouteTransport(Integer routeTransportId, boolean includePassword) {
        RouteTransportModel routeTransportModel = routeTransportRepository.getRouteTransportById(routeTransportId);

        if (routeTransportModel != null) {
            routeTransportModel.setRoute(routeRepository.getRoute(routeTransportModel.getRouteId()));
            // Sets also current status
            routeTransportModel.setStatusHistory(routeTransportStatusRepository.getTransportStatusHistory(routeTransportModel.getId()));

            List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteTransportId(routeTransportId);
            if (supervisions != null) {
                supervisions.forEach(supervision -> {
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

    public List<RouteTransportModel> getRouteTransportsOfPermit(Integer permitId) {
        List<RouteTransportModel> routeTransportModels = routeTransportRepository.getRouteTransportsByPermitId(permitId);

        if (routeTransportModels != null) {
            List<Integer> routeIds = routeTransportModels.stream().map(RouteTransportModel::getRouteId).distinct().collect(Collectors.toList());
            List<Integer> routeTransportIds = routeTransportModels.stream().map(RouteTransportModel::getId).collect(Collectors.toList());

            List<RouteModel> routeModels = routeRepository.getRoutesById(routeIds);
            List<RouteTransportStatusModel> rtStatusModels = routeTransportStatusRepository.getTransportStatusHistory(routeTransportIds);
            List<SupervisionModel> supervisionModels = supervisionRepository.getSupervisionsByRouteTransportId(routeTransportIds);

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

                    Map<Integer, List<SupervisionStatusModel>> supervisionStatusModels = supervisionStatusRepository.getSupervisionStatusHistories(
                        supervisionModels.stream().map(SupervisionModel::getId).collect(Collectors.toList())
                    );

                    supervisions.forEach(supervision -> {
                        supervision.setStatusHistory(supervisionStatusModels.get(supervision.getId()));
                    });
                }
                rtm.setSupervisions(supervisions);

                // Only for use with the transport company admin UI
                rtm.setCurrentTransportPassword(routeTransportPasswordRepository.getTransportPassword(rtm.getId()));
            });
        }

        return routeTransportModels;
    }

    public RouteTransportModel getRouteTransportOfSupervisor(Integer routeTransportId, SillariUser user) {
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
            List<SupervisionModel> supervisions = supervisionRepository.getSupervisionsByRouteTransportAndSupervisor(routeTransportId, user.getBusinessId());
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

    public Integer createRouteTransport(RouteTransportModel routeTransportModel) {
        // Generate a password and get a new expiry date when creating a new transport
        return routeTransportRepository.createRouteTransport(routeTransportModel,
                routeTransportPasswordRepository.generateUniqueTransportPassword());
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

    public Integer getNextAvailableTransportNumber(RouteTransportModel routeTransport, RouteModel route, String permitNumber) throws TransportNumberConflictException {
        Integer nextAvailableTransportNumber = routeTransportNumberService.getNextAvailableTransportNumber(route, permitNumber);

        // Check that next available route transport number matches the bridges
        List<SupervisionModel> supervisions = routeTransport.getSupervisions();
        if (supervisions != null && !supervisions.isEmpty()) {
            RouteBridgeModel routeBridge = supervisions.get(0).getRouteBridge();
            int selectedNumber = routeBridge != null ? routeBridge.getTransportNumber() : 0;

            if (!nextAvailableTransportNumber.equals(selectedNumber)) {
                logger.error("CONFLICT for nextAvailableTransportNumber {} vs bridge transportNumber {} with routeId {}", nextAvailableTransportNumber, selectedNumber, routeTransport.getRouteId());
                throw new TransportNumberConflictException("Next available transportNumber " + nextAvailableTransportNumber + " does not match the transport number " + selectedNumber + " of the bridges");
            }
        }
        return nextAvailableTransportNumber;
    }

    public void setTransportNumberUsed(RouteTransportModel routeTransport) {
        routeTransportNumberService.setTransportNumberUsed(routeTransport);
    }

    public void setTransportNumberAvailable(RouteTransportModel routeTransport) {
        routeTransportNumberService.setTransportNumberAvailable(routeTransport);
    }

}
