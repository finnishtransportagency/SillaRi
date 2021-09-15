package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.service.CompanyService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    @GetMapping(value = "/getcompanies", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getCompanies(@RequestParam(defaultValue = "10") Integer limit) {
        ServiceMetric serviceMetric = new ServiceMetric("CompanyController", "getAllCompanies");
        try {
            List<CompanyModel> companies = companyService.getCompanies(limit);
            return ResponseEntity.ok().body(companies != null ? companies : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get company list")
    @GetMapping(value = "/getcompanylist", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getCompanyList(@RequestParam(defaultValue = "10") Integer limit) {
        ServiceMetric serviceMetric = new ServiceMetric("CompanyController", "getCompanyList");
        try {
            List<CompanyModel> companyList = companyService.getCompanyList(limit);
            return ResponseEntity.ok().body(companyList != null ? companyList : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get company")
    @GetMapping(value = "/getcompany", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getCompany(@RequestParam Integer companyId) {
        ServiceMetric serviceMetric = new ServiceMetric("CompanyController", "getCompany");
        try {
            CompanyModel company = companyService.getCompany(companyId);
            return ResponseEntity.ok().body(company != null ? company : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }
}
