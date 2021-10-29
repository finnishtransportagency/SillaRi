package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteTransportPasswordModel;
import fi.vaylavirasto.sillari.repositories.RouteTransportPasswordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RouteTransportPasswordService {
    @Autowired
    RouteTransportPasswordRepository rtpRepository;

    public RouteTransportPasswordModel findRouteTransportPassword(String transportPassword) {
        RouteTransportPasswordModel rtpModels = rtpRepository.findRouteTransportPassword(transportPassword);
        return rtpModels;
    }
}
