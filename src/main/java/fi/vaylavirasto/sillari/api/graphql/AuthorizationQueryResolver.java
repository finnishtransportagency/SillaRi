package fi.vaylavirasto.sillari.api.graphql;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.AuthorizationModel;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.service.AuthorizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationQueryResolver implements GraphQLQueryResolver {
    @Autowired
    AuthorizationService authorizationService;
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public AuthorizationModel getAuthorization(Integer id) {
        ServiceMetric serviceMetric = new ServiceMetric("AuthorizationQueryResolver", "getAuthorization");
        try {
            return authorizationService.getAuthorization(id);
        } finally {
            serviceMetric.end();
        }
    }
}
