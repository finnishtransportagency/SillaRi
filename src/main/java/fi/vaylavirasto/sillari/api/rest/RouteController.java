package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.service.RouteService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
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
    @GetMapping("/getroute")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public RouteModel getRoute(@RequestParam Integer routeId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteController", "getRoute");
        try {
            return routeService.getRoute(routeId);
        } finally {
            serviceMetric.end();
        }
    }
}
