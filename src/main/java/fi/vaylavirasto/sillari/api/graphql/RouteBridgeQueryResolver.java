package fi.vaylavirasto.sillari.api.graphql;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.service.RouteBridgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
public class RouteBridgeQueryResolver implements GraphQLQueryResolver {
    @Autowired
    RouteBridgeService routeBridgeService;

    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public BridgeModel getRouteBridge(Integer id) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteBridgeQueryResolver", "getRouteBridgeByRouteIdAndBridgeId");
        try {
            return routeBridgeService.getRouteBridge(id);
        } finally {
            serviceMetric.end();
        }
    }
}
