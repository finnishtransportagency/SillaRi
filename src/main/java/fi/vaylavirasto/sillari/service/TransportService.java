package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.TransportDimensionsModel;
import fi.vaylavirasto.sillari.repositories.AxleRepository;
import fi.vaylavirasto.sillari.repositories.TransportDimensionsRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransportService {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    TransportDimensionsRepository transportDimensionsRepository;
    @Autowired
    AxleRepository axleRepository;

    public TransportDimensionsModel getTransport(Integer transportId) {
        TransportDimensionsModel transportDimensionsModel = transportDimensionsRepository.getTransportById(transportId);
        if (transportDimensionsModel != null) {
            transportDimensionsModel.setRegistrations(transportRegistrationRepository.getRegistrationsOfTransport(transportId));
            transportDimensionsModel.setAxles(axleRepository.getAxlesOfTransport(transportId));
        }
        return transportDimensionsModel;
    }

    public TransportDimensionsModel getTransportOfRoute(Integer permitId, Integer routeId) {
        TransportDimensionsModel transportDimensionsModel = transportDimensionsRepository.getTransportByPermitIdAndRouteId(permitId, routeId);
        if (transportDimensionsModel != null) {
            Integer transportId = Long.valueOf(transportDimensionsModel.getId()).intValue();
            transportDimensionsModel.setRegistrations(transportRegistrationRepository.getRegistrationsOfTransport(transportId));
            transportDimensionsModel.setAxles(axleRepository.getAxlesOfTransport(transportId));
        }
        return transportDimensionsModel;
    }
}
