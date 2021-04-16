package fi.vaylavirasto.sillari.api.graphql;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.TransportModel;
import fi.vaylavirasto.sillari.service.TransportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
public class TransportQueryResolver implements GraphQLQueryResolver {
    @Autowired
    TransportService transportService;

    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public TransportModel getTransport(Integer id) {
        ServiceMetric serviceMetric = new ServiceMetric("TransportQueryResolver", "getTransport");

        try {
            return transportService.getTransport(id);
        } finally {
            serviceMetric.end();
        }
    }
}
