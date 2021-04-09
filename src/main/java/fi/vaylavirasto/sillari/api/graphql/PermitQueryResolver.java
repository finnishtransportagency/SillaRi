package fi.vaylavirasto.sillari.api.graphql;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.service.PermitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
public class PermitQueryResolver implements GraphQLQueryResolver {
    @Autowired
    PermitService permitService;
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public PermitModel getPermit(Integer id) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitQueryResolver", "getPermit");
        try {
            return permitService.getPermit(id);
        } finally {
            serviceMetric.end();
        }
    }
}
