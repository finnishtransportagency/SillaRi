package fi.vaylavirasto.sillari.api.graphql;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.service.RouteService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
public class RouteQueryResolver implements GraphQLQueryResolver {
    @Autowired
    RouteService routeService;
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public RouteModel getRoute(Integer id) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteQueryResolver", "getRouteById");
        try {
            return routeService.getRoute(id);
        } finally {
            serviceMetric.end();
        }
    }

}
