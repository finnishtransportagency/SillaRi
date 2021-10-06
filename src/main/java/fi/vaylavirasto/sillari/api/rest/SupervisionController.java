package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionReportModel;
import fi.vaylavirasto.sillari.service.SupervisionService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@Timed
@RequestMapping("/supervision")
public class SupervisionController {

    @Autowired
    SupervisionService supervisionService;

    @Operation(summary = "Get supervision")
    @GetMapping(value = "/getsupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getSupervision(@RequestParam Integer supervisionId) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "getSupervision");
        try {
            SupervisionModel supervisionModel = supervisionService.getSupervision(supervisionId);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get supervision of route bridge")
    @GetMapping(value = "/getsupervisionofroutebridge", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getSupervisionOfRouteBridge(@RequestParam Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "getSupervisionOfRouteBridge");
        try {
            SupervisionModel supervisionModel = supervisionService.getSupervisionOfRouteBridge(routeBridgeId);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Create planned supervision")
    @PostMapping(value = "/createsupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> createSupervision(@RequestBody SupervisionModel supervision) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "createSupervision");
        try {
            SupervisionModel supervisionModel = supervisionService.createSupervision(supervision);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Update supervision")
    @PutMapping(value = "/updatesupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> updateSupervision(@RequestBody SupervisionModel supervision) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "updateSupervision");
        try {
            SupervisionModel supervisionModel = supervisionService.updateSupervision(supervision);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Start supervision, create empty supervision report")
    @PostMapping(value = "/startsupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> startSupervision(@RequestParam Integer supervisionId) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "startSupervision");
        try {
            SupervisionModel supervisionModel = supervisionService.startSupervision(supervisionId);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Cancel supervision")
    @PostMapping(value = "/cancelsupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> cancelSupervision(@RequestBody SupervisionModel supervision) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "cancelSupervision");
        try {
            SupervisionModel supervisionModel = supervisionService.cancelSupervision(supervision);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Finish supervision")
    @PostMapping(value = "/finishsupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> finishSupervision(@RequestBody SupervisionModel supervision) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "finishSupervision");
        try {
            SupervisionModel supervisionModel = supervisionService.finishSupervision(supervision);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Update supervision report")
    @PutMapping(value = "/updatesupervisionreport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> updateSupervisionReport(@RequestBody SupervisionReportModel report) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "updateSupervisionReport");
        try {
            SupervisionModel supervisionModel = supervisionService.updateSupervisionReport(report);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

}
