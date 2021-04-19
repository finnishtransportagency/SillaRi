package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.AxleModel;
import fi.vaylavirasto.sillari.model.TransportModel;
import fi.vaylavirasto.sillari.model.TransportRegistrationModel;
import fi.vaylavirasto.sillari.repositories.AxleRepository;
import fi.vaylavirasto.sillari.repositories.TransportRegistrationRepository;
import fi.vaylavirasto.sillari.repositories.TransportRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransportService {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    TransportRepository transportRepository;
    @Autowired
    TransportRegistrationRepository transportRegistrationRepository;
    @Autowired
    AxleRepository axleRepository;

    public TransportModel getTransport(Integer transportId) {
        TransportModel transportModel = transportRepository.getTransportById(transportId);
        if (transportModel != null) {
            transportModel.setRegistrations(transportRegistrationRepository.getRegistrationsOfTransport(transportId));
            transportModel.setAxles(axleRepository.getAxlesOfTransport(transportId));
        }
        return transportModel;
    }

    public TransportModel getTransportOfRoute(Integer permitId, Integer routeId) {
        TransportModel transportModel = transportRepository.getTransportByPermitIdAndRouteId(permitId, routeId);
        if (transportModel != null) {
            Integer transportId = Long.valueOf(transportModel.getId()).intValue();
            transportModel.setRegistrations(transportRegistrationRepository.getRegistrationsOfTransport(transportId));
            transportModel.setAxles(axleRepository.getAxlesOfTransport(transportId));
        }
        return transportModel;
    }
}
