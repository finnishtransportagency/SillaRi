package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteTransportPasswordModel;
import fi.vaylavirasto.sillari.repositories.RouteTransportPasswordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RouteTransportPasswordService {
    @Autowired
    RouteTransportPasswordRepository rtpRepository;

    public RouteTransportPasswordModel findRouteTransportPassword(String transportPassword) {
        RouteTransportPasswordModel rtpModels = rtpRepository.findRouteTransportPassword(transportPassword);
        return rtpModels;
    }

    public RouteTransportPasswordModel generateRouteTransportPassword(Integer routeTransportId) {
        // Generate a password but keep the same expiry date
        // This is used by the 'new password' button in the transport company admin UI
        rtpRepository.updateTransportPassword(routeTransportId, rtpRepository.generateUniqueTransportPassword());
        return rtpRepository.getTransportPassword(routeTransportId);
    }
}
