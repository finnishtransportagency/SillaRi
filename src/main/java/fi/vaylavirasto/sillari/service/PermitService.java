package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.AxleModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.VehicleModel;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import fi.vaylavirasto.sillari.repositories.AxleRepository;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
import fi.vaylavirasto.sillari.repositories.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermitService {
    @Autowired
    PermitRepository permitRepository;
    @Autowired
    AxleRepository axleRepository;
    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    RouteBridgeRepository routeBridgeRepository;

    public PermitModel getPermit(Integer permitId) {
        PermitModel permitModel = permitRepository.getPermit(permitId);
        fillPermitDetails(permitModel);
        return permitModel;
    }

    public PermitModel getPermitOfRoute(Integer routeId) {
        PermitModel permitModel = permitRepository.getPermitByRouteId(routeId);
        fillPermitDetails(permitModel);
        return permitModel;
    }

    public PermitModel getPermitOfRouteBridge(Integer routeBridgeId) {
        PermitModel permitModel = permitRepository.getPermitByRouteBridgeId(routeBridgeId);
        fillPermitDetails(permitModel);
        return permitModel;
    }

    public PermitModel getPermitOfRouteTransport(Integer routeTransportId) {
        PermitModel permitModel = permitRepository.getPermitByRouteTransportId(routeTransportId);
        fillPermitDetails(permitModel);
        return permitModel;
    }

    private void fillPermitDetails(PermitModel permitModel) {
        if (permitModel != null) {
            List<AxleModel> axles = axleRepository.getAxlesOfChart(permitModel.getAxleChart().getId());
            permitModel.setAxles(axles);

            List<VehicleModel> vehicles = vehicleRepository.getVehiclesOfPermit(permitModel.getId());
            permitModel.setVehicles(vehicles);

            List<RouteModel> routes = routeRepository.getRoutesByPermitId(permitModel.getId());
            permitModel.setRoutes(routes);

            // The transport company UI needs the route bridges for all routes in the permit
            // TODO - if this returns too much data, add this as a separate method in RouteController
            if (permitModel.getRoutes() != null) {
                permitModel.getRoutes().forEach(routeModel -> {
                    List<RouteBridgeModel> routeBridgeModels = routeBridgeRepository.getRouteBridges(routeModel.getId());
                    routeModel.setRouteBridges(routeBridgeModels);
                });
            }
        }
    }
}
