package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.TransportDimensionsModel;
import fi.vaylavirasto.sillari.repositories.AxleRepository;
import fi.vaylavirasto.sillari.repositories.TransportDimensionsRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransportDimensionsService {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    TransportDimensionsRepository transportDimensionsRepository;


    public TransportDimensionsModel getTransportDimensionsOfPermit(Integer permitId) {
        TransportDimensionsModel transportDimensionsModel = transportDimensionsRepository.getTransportDimensionsByPermitId(permitId);
        return transportDimensionsModel;
    }
}
