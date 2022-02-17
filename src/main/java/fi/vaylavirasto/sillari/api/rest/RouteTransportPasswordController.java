package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.RouteTransportPasswordModel;
import fi.vaylavirasto.sillari.service.CompanyService;
import fi.vaylavirasto.sillari.service.PermitService;
import fi.vaylavirasto.sillari.service.RouteTransportPasswordService;
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


@RestController
@Timed
@RequestMapping("/transportpassword")
public class RouteTransportPasswordController {
    @Autowired
    RouteTransportPasswordService rtpService;
    @Autowired
    PermitService permitService;
    @Autowired
    CompanyService companyService;
    @Autowired
    UIService uiService;

    @Operation(summary = "Transport login")
    @GetMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> findRouteTransportPassword(@RequestParam String transportPassword) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportPasswordController", "findRouteTransportPassword");
        try {
            RouteTransportPasswordModel rtp = rtpService.findRouteTransportPassword(transportPassword);
            return ResponseEntity.ok().body(rtp != null ? rtp : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Generate new transport password")
    @GetMapping(value = "/generate", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public ResponseEntity<?> generateNewRouteTransportPassword(@RequestParam Integer routeTransportId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportPasswordController", "generateNewRouteTransportPassword");
        try {
            if (!isOwnCompanyRouteTransport(routeTransportId)) {
                throw new AccessDeniedException("Not user company route transport.");
            }
            RouteTransportPasswordModel rtp = rtpService.generateRouteTransportPassword(routeTransportId);
            return ResponseEntity.ok().body(rtp != null ? rtp : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    /* Check that transport company matches ajojärjestelija- or kuljettaja-user company */
    private boolean isOwnCompanyRouteTransport(Integer routeTransportId) {
        CompanyModel cm = companyService.getCompanyByRouteTransportId(routeTransportId);
        SillariUser user = uiService.getSillariUser();
        return user.getBusinessId().equals(cm.getBusinessId());
    }
}
