package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.CrossingInputModel;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.service.CrossingService;
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

@RestController
@Timed
@RequestMapping("/crossing")
public class CrossingController {
    @Autowired
    CrossingService crossingService;

    @Operation(summary = "Get crossing")
    @GetMapping(value = "/getcrossing", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getCrossing(@RequestParam Integer crossingId) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingController", "getCrossing");
        try {
            CrossingModel crossing = crossingService.getCrossing(crossingId);
            return ResponseEntity.ok().body(crossing != null ? crossing : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get crossing of route bridge")
    @GetMapping(value = "/getcrossingofroutebridge", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getCrossingOfRouteBridge(@RequestParam Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingController", "getCrossingOfRouteBridge");
        try {
            CrossingModel crossing = crossingService.getCrossingOfRouteBridge(routeBridgeId);
            return ResponseEntity.ok().body(crossing != null ? crossing : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Start crossing")
    @PostMapping(value = "/startcrossing", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> startCrossing(@RequestParam Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingController", "startCrossing");
        try {
            CrossingModel crossing = crossingService.createCrossing(routeBridgeId);
            return ResponseEntity.ok().body(crossing != null ? crossing : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Update crossing")
    @PutMapping(value = "/updatecrossing", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> updateCrossing(@RequestBody CrossingInputModel crossingInputModel) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingController", "updateCrossing");
        try {
            CrossingModel crossing = crossingService.updateCrossing(crossingInputModel);
            return ResponseEntity.ok().body(crossing != null ? crossing : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }
}
