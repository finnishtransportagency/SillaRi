package fi.vaylavirasto.sillari.api.graphql;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.service.RouteBridgeService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
public class RouteBridgeQueryResolver implements GraphQLQueryResolver {
    @Autowired
    RouteBridgeService routeBridgeService;

    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public RouteBridgeModel getRouteBridge(Integer id) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteBridgeQueryResolver", "getRouteBridgeById");
        try {
            return routeBridgeService.getRouteBridge(id);
        } finally {
            serviceMetric.end();
        }
    }
}
