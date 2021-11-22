package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.dto.CompanyTransportsDTO;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.service.CompanyService;
import fi.vaylavirasto.sillari.service.UIService;
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
    UIService uiService;
    @Autowired
    private CompanyService companyService;

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

    @Operation(summary = "Get supervisor transports grouped by company")
    @GetMapping(value = "/getcompanytransportlistofsupervisor", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getCompanyTransportListOfSupervisor() {
        ServiceMetric serviceMetric = new ServiceMetric("CompanyController", "getCompanyTransportListOfSupervisor");
        try {
            SillariUser user = uiService.getSillariUser();
            List<CompanyTransportsDTO> companyList = companyService.getCompanyTransportListOfSupervisor(user.getUsername());
            return ResponseEntity.ok().body(companyList != null ? companyList : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }
}
