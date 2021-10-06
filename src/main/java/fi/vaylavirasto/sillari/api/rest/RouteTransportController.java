package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.service.RouteTransportService;
import fi.vaylavirasto.sillari.service.SupervisionService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Timed
@RequestMapping("/routetransport")
public class RouteTransportController {
    @Autowired
    RouteTransportService routeTransportService;
    @Autowired
    SupervisionService supervisionService;

    @Operation(summary = "Get route transport")
    @GetMapping(value = "/getroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getRouteTransport(@RequestParam Integer routeTransportId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "getRouteTransport");
        try {
            RouteTransportModel routeTransport = routeTransportService.getRouteTransport(routeTransportId);
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
            List<RouteTransportModel> routeTransports = routeTransportService.getRouteTransportsOfPermit(permitId);
            return ResponseEntity.ok().body(routeTransports != null ? routeTransports : new EmptyJsonResponse());
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
            RouteTransportModel insertedRouteTransport = routeTransportService.createRouteTransport(routeTransport);

            if (routeTransport.getSupervisions() != null) {
                routeTransport.getSupervisions().forEach(supervisionModel -> {
                    if (supervisionModel.getId() != null && supervisionModel.getId() > 0) {
                        supervisionService.updateSupervision(supervisionModel);
                    } else {
                        supervisionService.createSupervision(supervisionModel);
                    }
                });
            }

            RouteTransportModel routeTransportModel = routeTransportService.getRouteTransport(insertedRouteTransport.getId());
            return ResponseEntity.ok().body(routeTransportModel != null ? routeTransportModel : new EmptyJsonResponse());
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
            RouteTransportModel updatedTransportModel = routeTransportService.updateRouteTransport(routeTransport);

            if (routeTransport.getSupervisions() != null) {
                routeTransport.getSupervisions().forEach(supervisionModel -> {
                    if (supervisionModel.getId() != null && supervisionModel.getId() > 0) {
                        supervisionService.updateSupervision(supervisionModel);
                    } else {
                        supervisionService.createSupervision(supervisionModel);
                    }
                });
            }

            RouteTransportModel routeTransportModel = routeTransportService.getRouteTransport(updatedTransportModel.getId());
            return ResponseEntity.ok().body(routeTransportModel != null ? routeTransportModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }
}
