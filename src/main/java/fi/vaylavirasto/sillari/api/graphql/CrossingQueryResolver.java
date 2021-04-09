package fi.vaylavirasto.sillari.api.graphql;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.service.CrossingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CrossingQueryResolver implements GraphQLQueryResolver {
    @Autowired
    CrossingService crossingService;
    public CrossingModel getCrossing(Integer crossingId, Boolean draft) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingQueryResolver", "getCrossing");
        try {
            return crossingService.getCrossing(crossingId, draft);
        } finally {
            serviceMetric.end();
        }
    }
}
