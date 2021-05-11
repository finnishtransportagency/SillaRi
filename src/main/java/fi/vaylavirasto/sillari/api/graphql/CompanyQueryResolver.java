package fi.vaylavirasto.sillari.api.graphql;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.service.CompanyService;
import graphql.kickstart.tools.GraphQLQueryResolver;
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

    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public List<CompanyModel> getCompanyList(Integer limit) {
        ServiceMetric serviceMetric = new ServiceMetric("CompanyQueryResolver", "getCompanyList");
        try {
            return companyService.getCompanyList(limit);
        } finally {
            serviceMetric.end();
        }
    }

    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public CompanyModel getCompany(Integer id) {
        ServiceMetric serviceMetric = new ServiceMetric("CompanyQueryResolver", "getCompany");
        try {
            return companyService.getCompany(id);
        } finally {
            serviceMetric.end();
        }
    }
}
