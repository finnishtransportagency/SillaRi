package fi.vaylavirasto.sillari.api.graphql;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.TransportModel;
import fi.vaylavirasto.sillari.service.TransportService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TransportQueryResolver implements GraphQLQueryResolver {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    TransportService transportService;

    public List<TransportModel> getTransports() {
        ServiceMetric serviceMetric = new ServiceMetric("TransportQueryResolver", "getTransports");
        try {
            return transportService.getTransports();
        } finally {
            serviceMetric.end();
        }
    }
    public TransportModel getTransport(int id) {
        ServiceMetric serviceMetric = new ServiceMetric("TransportQueryResolver", "getTransport");
        try {
            return transportService.getTransport(id);
        } finally {
            serviceMetric.end();
        }
    }
}
