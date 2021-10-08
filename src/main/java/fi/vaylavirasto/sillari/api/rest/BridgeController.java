package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.service.BridgeService;
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
@RequestMapping("/bridge")
public class BridgeController {
    @Autowired
    BridgeService bridgeService;

    @Operation(summary = "Get bridge")
    @GetMapping(value = "/getbridge", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getBridge(@RequestParam Integer bridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("BridgeController", "getBridge");
        try {
            BridgeModel bridge = bridgeService.getBridge(bridgeId);
            return ResponseEntity.ok().body(bridge != null ? bridge : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

}
