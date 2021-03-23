package fi.vaylavirasto.sillari.api.graphql;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.service.CompanyService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CompanyQueryResolver implements GraphQLQueryResolver {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    CompanyService companyService;

    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public List<CompanyModel> getCompanies(Integer limit) {
        ServiceMetric serviceMetric = new ServiceMetric("CompanyQueryResolver", "getAllCompanies");
        try {
            return companyService.getCompanies(limit);
        } finally {
            serviceMetric.end();
        }
    }
}
