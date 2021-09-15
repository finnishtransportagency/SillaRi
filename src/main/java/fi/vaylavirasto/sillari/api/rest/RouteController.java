package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.service.RouteService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Timed
@RequestMapping("/route")
public class RouteController {
    @Autowired
    RouteService routeService;

    @Operation(summary = "Get route")
    @GetMapping(value = "/getroute", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getRoute(@RequestParam Integer routeId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteController", "getRoute");
        try {
            RouteModel route = routeService.getRoute(routeId);
            return ResponseEntity.ok().body(route != null ? route : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }
}
