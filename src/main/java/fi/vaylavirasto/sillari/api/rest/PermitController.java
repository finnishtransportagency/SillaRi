package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.service.PermitService;
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
@RequestMapping("/permit")
public class PermitController {
    @Autowired
    PermitService permitService;

    @Operation(summary = "Get permit")
    @GetMapping(value = "/getpermit", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getPermit(@RequestParam Integer permitId) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermit");
        try {
            PermitModel permit = permitService.getPermit(permitId);
            return ResponseEntity.ok().body(permit != null ? permit : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get permit of route")
    @GetMapping(value = "/getpermitofroute", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getPermitOfRoute(@RequestParam Integer routeId) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitOfRoute");
        try {
            PermitModel permit = permitService.getPermitOfRoute(routeId);
            return ResponseEntity.ok().body(permit != null ? permit : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get permit of route bridge")
    @GetMapping(value = "/getpermitofroutebridge", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getPermitOfRouteBridge(@RequestParam Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitOfRouteBridge");
        try {
            PermitModel permit = permitService.getPermitOfRouteBridge(routeBridgeId);
            return ResponseEntity.ok().body(permit != null ? permit : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }
}
