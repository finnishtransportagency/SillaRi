package fi.vaylavirasto.sillari.api.graphql;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.CrossingInputModel;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.service.CrossingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
public class CrossingMutationResolver implements GraphQLMutationResolver  {
    @Autowired
    CrossingService crossingService;
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public CrossingModel updateCrossing(CrossingInputModel crossingInputModel) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingMutationResolver", "updateCrossing");
        try {
            return crossingService.updateCrossing(crossingInputModel);
        } finally {
            serviceMetric.end();
        }
    }
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public CrossingModel startCrossing(Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingMutationResolver", "startCrossing");
        try {
            return crossingService.createCrossing(routeBridgeId);
        } finally {
            serviceMetric.end();
        }
    }
}
