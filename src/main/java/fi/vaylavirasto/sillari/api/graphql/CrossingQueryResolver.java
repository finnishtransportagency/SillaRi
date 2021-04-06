package fi.vaylavirasto.sillari.api.graphql;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.service.CrossingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CrossingQueryResolver implements GraphQLQueryResolver {
    @Autowired
    CrossingService crossingService;
    public CrossingModel getCrossing(Integer crossingId) {
        return crossingService.getCrossing(crossingId);
    }
}
