package fi.vaylavirasto.sillari.api.rest.transport;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.RouteTransportPasswordModel;
import fi.vaylavirasto.sillari.model.RouteTransportStatusModel;
import fi.vaylavirasto.sillari.service.RouteTransportService;
import fi.vaylavirasto.sillari.service.CompanyService;
import fi.vaylavirasto.sillari.service.PermitService;
import fi.vaylavirasto.sillari.service.RouteTransportPasswordService;
import fi.vaylavirasto.sillari.service.UIService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Timed
@RequestMapping("/transport")
@PreAuthorize("@sillariRightsChecker.isSillariKuljettaja(authentication)")
public class TransportRouteTransportController {
    @Autowired
    UIService uiService;
    @Autowired
    RouteTransportPasswordService rtpService;
    @Autowired
    RouteTransportService routeTransportService;
    @Autowired
    PermitService permitService;
    @Autowired
    CompanyService companyService;

    /* Check that transport company matches ajojärjestelija- or kuljettaja-user company */
    private boolean isOwnCompanyRouteTransport(Integer routeTransportId) {
        CompanyModel cm = companyService.getCompanyByRouteTransportId(routeTransportId);
        SillariUser user = uiService.getSillariUser();
        return user.getBusinessId().equals(cm.getBusinessId());
    }

    @Operation(summary = "Transport login")
    @GetMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> findRouteTransportPassword(@RequestParam String transportPassword) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportPasswordController", "findRouteTransportPassword");
        try {            
            RouteTransportPasswordModel rtp = rtpService.findRouteTransportPassword(transportPassword);
            if (rtp == null || !isOwnCompanyRouteTransport(rtp.getRouteTransportId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new EmptyJsonResponse());
            }

            return ResponseEntity.ok().body(rtp);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get route transport")
    @GetMapping(value = "/getroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getRouteTransport(@RequestParam String transportPassword) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "getRouteTransport");
        try {
            RouteTransportPasswordModel rtp = rtpService.findRouteTransportPassword(transportPassword);
            if (rtp == null || !isOwnCompanyRouteTransport(rtp.getRouteTransportId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new EmptyJsonResponse());
            }

            RouteTransportModel routeTransport = routeTransportService.getRouteTransport(rtp.getRouteTransportId(), false, false);
            return ResponseEntity.ok().body(routeTransport != null ? routeTransport : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get permit of route transport")
    @GetMapping(value = "/getpermitofroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPermitOfRouteTransport(@RequestParam String transportPassword) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitOfRouteTransport");
        try {
            RouteTransportPasswordModel rtp = rtpService.findRouteTransportPassword(transportPassword);
            if (rtp == null || !isOwnCompanyRouteTransport(rtp.getRouteTransportId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new EmptyJsonResponse());
            }

            PermitModel permit = permitService.getPermitOfRouteTransport(rtp.getRouteTransportId());
            return ResponseEntity.ok().body(permit != null ? permit : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Change route transport status")
    @PostMapping(value = "/changeroutetransportstatus", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> changeRouteTransportStatus(
        @RequestParam String transportPassword,
        @RequestBody RouteTransportStatusModel routeTransportStatus
    ) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "changeRouteTransportStatus");
        try {
            if (routeTransportStatus == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new EmptyJsonResponse());
            }

            RouteTransportPasswordModel rtp = rtpService.findRouteTransportPassword(transportPassword);
            if (rtp == null || !isOwnCompanyRouteTransport(rtp.getRouteTransportId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new EmptyJsonResponse());
            }

            routeTransportService.addRouteTransportStatus(routeTransportStatus);
            return ResponseEntity.ok().body(new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }
}
