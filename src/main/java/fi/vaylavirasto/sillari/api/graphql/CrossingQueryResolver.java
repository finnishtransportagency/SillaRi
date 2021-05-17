package fi.vaylavirasto.sillari.api.graphql;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.service.CrossingService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
public class CrossingQueryResolver implements GraphQLQueryResolver {
    @Autowired
    CrossingService crossingService;

    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public CrossingModel getCrossing(Integer crossingId) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingQueryResolver", "getCrossing");
        try {
            return crossingService.getCrossing(crossingId);
        } finally {
            serviceMetric.end();
        }
    }
}
