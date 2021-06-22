package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.service.CompanyService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Timed
@RequestMapping("/company")
public class CompanyController {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private CompanyService companyService;

    @Operation(summary = "Get companies")
    @GetMapping("/getcompanies")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public List<CompanyModel> getCompanies(@RequestParam(defaultValue = "10") Integer limit) {
        ServiceMetric serviceMetric = new ServiceMetric("CompanyController", "getAllCompanies");
        try {
            return companyService.getCompanies(limit);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get company list")
    @GetMapping("/getcompanylist")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public List<CompanyModel> getCompanyList(@RequestParam(defaultValue = "10") Integer limit) {
        ServiceMetric serviceMetric = new ServiceMetric("CompanyController", "getCompanyList");
        try {
            return companyService.getCompanyList(limit);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get company")
    @GetMapping("/getcompany")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public CompanyModel getCompany(@RequestParam Integer companyId) {
        ServiceMetric serviceMetric = new ServiceMetric("CompanyController", "getCompany");
        try {
            return companyService.getCompany(companyId);
        } finally {
            serviceMetric.end();
        }
    }
}
