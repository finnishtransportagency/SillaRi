package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.service.RouteBridgeService;
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

import java.util.List;

@RestController
@Timed
@RequestMapping("/routebridge")
public class RouteBridgeController {
    @Autowired
    RouteBridgeService routeBridgeService;

    @Operation(summary = "Get route bridge")
    @GetMapping(value = "/getroutebridge", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getRouteBridge(@RequestParam Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteBridgeController", "getRouteBridge");
        try {
            RouteBridgeModel routeBridge = routeBridgeService.getRouteBridge(routeBridgeId);
            return ResponseEntity.ok().body(routeBridge != null ? routeBridge : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get route bridges of supervisor")
    @GetMapping(value = "/getroutebridgesofsupervisor", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getRouteBridgesOfSupervisor(@RequestParam Integer supervisorId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteBridgeController", "getRouteBridgesOfSupervisor");
        try {
            List<RouteBridgeModel> routeBridges = routeBridgeService.getRouteBridgesOfSupervisor(supervisorId);
            return ResponseEntity.ok().body(routeBridges != null ? routeBridges : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }
}
