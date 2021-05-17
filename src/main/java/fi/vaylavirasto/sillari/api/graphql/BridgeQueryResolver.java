package fi.vaylavirasto.sillari.api.graphql;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.service.BridgeService;
import graphql.kickstart.tools.GraphQLQueryResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
public class BridgeQueryResolver implements GraphQLQueryResolver {
    @Autowired
    BridgeService bridgeService;

    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public BridgeModel getBridge(Integer id) {
        ServiceMetric serviceMetric = new ServiceMetric("BridgeQueryResolver", "getBridgeById");
        try {
            return bridgeService.getBridge(id);
        } finally {
            serviceMetric.end();
        }
    }
}
