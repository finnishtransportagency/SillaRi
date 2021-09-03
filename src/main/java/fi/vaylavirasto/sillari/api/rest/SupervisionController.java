package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.service.SupervisionService;
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
            SupervisionModel supervision = supervisionService.getSupervision(supervisionId);
            return ResponseEntity.ok().body(supervision != null ? supervision : new EmptyJsonResponse());
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
            SupervisionModel supervision = supervisionService.getSupervisionOfRouteBridge(routeBridgeId);
            return ResponseEntity.ok().body(supervision != null ? supervision : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

}
