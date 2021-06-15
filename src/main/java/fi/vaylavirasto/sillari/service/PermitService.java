package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.AxleModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.VehicleMapper;
import fi.vaylavirasto.sillari.model.VehicleModel;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import fi.vaylavirasto.sillari.repositories.AxleRepository;
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

    public PermitModel getPermit(Integer permitId) {
        PermitModel permitModel = permitRepository.getPermit(permitId);
        if (permitModel != null) {
            List<AxleModel> axles = axleRepository.getAxlesOfChart(Long.valueOf(permitModel.getAxleChart().getId()).intValue());
            permitModel.setAxles(axles);
        }
        if (permitModel != null) {
            List<VehicleModel> vehicles = vehicleRepository.getVehiclesOfPermit(Long.valueOf(permitModel.getId()).intValue());
            permitModel.setVehicles(vehicles);
        }
        return permitModel;
    }

    public PermitModel getPermitOfRouteBridge(Integer routeBridgeId) {
        PermitModel permitModel = permitRepository.getPermitByRouteBridgeId(routeBridgeId);
        if (permitModel != null) {
            List<AxleModel> axles = axleRepository.getAxlesOfChart(Long.valueOf(permitModel.getAxleChart().getId()).intValue());
            permitModel.setAxles(axles);
        }
        if (permitModel != null) {
            List<VehicleModel> vehicles = vehicleRepository.getVehiclesOfPermit(Long.valueOf(permitModel.getId()).intValue());
            permitModel.setVehicles(vehicles);
        }
        return permitModel;
    }
}
