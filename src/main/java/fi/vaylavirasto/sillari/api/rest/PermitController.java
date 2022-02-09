package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.service.CompanyService;
import fi.vaylavirasto.sillari.service.PermitService;
import fi.vaylavirasto.sillari.service.UIService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@Timed
@RequestMapping("/permit")
public class PermitController {
    @Autowired
    PermitService permitService;
    @Autowired
    CompanyService companyService;
    @Autowired
    UIService uiService;

    @Operation(summary = "Get permit")
    @GetMapping(value = "/getpermit", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getPermit(@RequestParam Integer permitId) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermit");
        try {
            if (!isOwnCompanyPermit(permitId)) {
                throw new AccessDeniedException("Not user company permit.");
            }
            PermitModel permit = permitService.getPermit(permitId);
            return ResponseEntity.ok().body(permit != null ? permit : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get permit of route transport")
    @GetMapping(value = "/getpermitofroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getPermitOfRouteTransport(@RequestParam Integer routeTransportId) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitOfRouteTransport");
        try {
            if (!isOwnCompanyRouteTransport(routeTransportId)) {
                throw new AccessDeniedException("Not user company route transport.");
            }
            PermitModel permit = permitService.getPermitOfRouteTransport(routeTransportId);
            return ResponseEntity.ok().body(permit != null ? permit : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get permit pdf")
    @GetMapping(value = "/getpermitpdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public void getPermitPdf(HttpServletResponse response, @RequestParam String objectKey) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitPdf");
        try {
            permitService.getPermitPdf(response, objectKey);
        } finally {
            serviceMetric.end();
        }
    }

    /* Check that permit company matches user company */
    private boolean isOwnCompanyPermit(Integer permitId) {
        CompanyModel cm = companyService.getCompanyByPermitId(permitId);
        SillariUser user = uiService.getSillariUser();
        return user.getBusinessId().equals(cm.getBusinessId());
    }

    /* Check that transport company matches user company */
    private boolean isOwnCompanyRouteTransport(Integer routeTransportId) {
        CompanyModel cm = companyService.getCompanyByRouteTransportId(routeTransportId);
        SillariUser user = uiService.getSillariUser();
        return user.getBusinessId().equals(cm.getBusinessId());
    }
}
