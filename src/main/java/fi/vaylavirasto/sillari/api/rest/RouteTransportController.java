package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.TransportStatusType;
import fi.vaylavirasto.sillari.service.CompanyService;
import fi.vaylavirasto.sillari.service.RouteTransportService;
import fi.vaylavirasto.sillari.service.SupervisionService;
import fi.vaylavirasto.sillari.service.UIService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Timed
@RequestMapping("/routetransport")
public class RouteTransportController {
    @Autowired
    UIService uiService;
    @Autowired
    RouteTransportService routeTransportService;
    @Autowired
    SupervisionService supervisionService;
    @Autowired
    CompanyService companyService;

    @Operation(summary = "Get route transport")
    @GetMapping(value = "/getroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public ResponseEntity<?> getRouteTransport(@RequestParam Integer routeTransportId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "getRouteTransport");
        try {
            if (!isOwnCompanyRouteTransport(routeTransportId)) {
                throw new AccessDeniedException("Not own company route transport");
            }
            RouteTransportModel routeTransport = routeTransportService.getRouteTransport(routeTransportId, true);
            return ResponseEntity.ok().body(routeTransport != null ? routeTransport : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get route transports of permit")
    @GetMapping(value = "/getroutetransportsofpermit", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getRouteTransportsOfPermit(@RequestParam Integer permitId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "getRouteTransportsOfPermit");
        try {
            // TODO - restrict this method to transport company admin users only
            List<RouteTransportModel> routeTransports = routeTransportService.getRouteTransportsOfPermit(permitId, true);
            return ResponseEntity.ok().body(routeTransports != null ? routeTransports : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get route transport of supervisor, with supervisions and route data")
    @GetMapping(value = "/getroutetransportofsupervisor", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getRouteTransportOfSupervisor(@RequestParam Integer routeTransportId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "getRouteTransportOfSupervisor");
        try {
            SillariUser user = uiService.getSillariUser();
            RouteTransportModel routeTransport = routeTransportService.getRouteTransportOfSupervisor(routeTransportId, user.getUsername());
            return ResponseEntity.ok().body(routeTransport != null ? routeTransport : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Create route transport")
    @PostMapping(value = "/createroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> createRouteTransport(@RequestBody RouteTransportModel routeTransport) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "createRouteTransport");
        try {
            SillariUser user = uiService.getSillariUser();

            // TODO - restrict this method to transport company admin users only
            RouteTransportModel insertedRouteTransport = routeTransportService.createRouteTransport(routeTransport);

            if (routeTransport.getSupervisions() != null && insertedRouteTransport != null) {
                routeTransport.getSupervisions().forEach(supervisionModel -> {
                    supervisionModel.setRouteTransportId(insertedRouteTransport.getId());

                    if (supervisionModel.getId() != null && supervisionModel.getId() > 0) {
                        supervisionService.updateSupervision(supervisionModel);
                    } else {
                        supervisionService.createSupervision(supervisionModel, user);
                    }
                });
            }

            if (insertedRouteTransport != null) {
                RouteTransportModel routeTransportModel = routeTransportService.getRouteTransport(insertedRouteTransport.getId(), true);
                return ResponseEntity.ok().body(routeTransportModel != null ? routeTransportModel : new EmptyJsonResponse());
            } else {
                return ResponseEntity.ok().body(new EmptyJsonResponse());
            }
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Update route transport")
    @PutMapping(value = "/updateroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> updateRouteTransport(@RequestBody RouteTransportModel routeTransport) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "updateRouteTransport");
        try {
            SillariUser user = uiService.getSillariUser();

            // TODO - restrict this method to transport company admin users only
            RouteTransportModel updatedTransportModel = routeTransportService.updateRouteTransport(routeTransport);

            if (routeTransport.getSupervisions() != null) {
                routeTransport.getSupervisions().forEach(supervisionModel -> {
                    if (supervisionModel.getId() != null && supervisionModel.getId() > 0) {
                        supervisionService.updateSupervision(supervisionModel);
                    } else {
                        supervisionService.createSupervision(supervisionModel, user);
                    }
                });
            }

            if (updatedTransportModel != null) {
                RouteTransportModel routeTransportModel = routeTransportService.getRouteTransport(updatedTransportModel.getId(), true);
                return ResponseEntity.ok().body(routeTransportModel != null ? routeTransportModel : new EmptyJsonResponse());
            } else {
                return ResponseEntity.ok().body(new EmptyJsonResponse());
            }
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Delete route transport")
    @DeleteMapping(value = "/deleteroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public boolean deleteRouteTransport(@RequestParam Integer routeTransportId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "updateRouteTransport");
        try {
            // TODO - restrict this method to transport company admin users only

            // Fetch all the route transport details including the status which is not sent
            RouteTransportModel routeTransport = routeTransportService.getRouteTransport(routeTransportId, false);

            // Only route transports with planned status can be deleted
            if (routeTransport != null && routeTransport.getCurrentStatus() != null &&
                    routeTransport.getCurrentStatus().getStatus() == TransportStatusType.PLANNED) {

                // Delete the supervision related data
                if (routeTransport.getSupervisions() != null) {
                    routeTransport.getSupervisions().forEach(supervisionModel -> {
                        if (supervisionModel.getId() != null && supervisionModel.getId() > 0) {
                            supervisionService.deleteSupervision(supervisionModel);
                        }
                    });
                }

                // Delete the route transport related data
                routeTransportService.deleteRouteTransport(routeTransport);

                return true;
            } else {
                return false;
            }
        } finally {
            serviceMetric.end();
        }
    }

    /* Check that transport company matches user company */
    private boolean isOwnCompanyRouteTransport(Integer routeTransportId) {
        CompanyModel cm = companyService.getCompanyByRouteTransportId(routeTransportId);
        SillariUser user = uiService.getSillariUser();
        return user.getBusinessId().equals(cm.getBusinessId());
    }
}
