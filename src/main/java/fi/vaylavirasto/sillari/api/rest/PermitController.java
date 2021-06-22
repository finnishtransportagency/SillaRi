package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.service.PermitService;
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
@RequestMapping("/permit")
public class PermitController {
    @Autowired
    PermitService permitService;

    @Operation(summary = "Get permit")
    @GetMapping("/getpermit")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public PermitModel getPermit(@RequestParam Integer permitId) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermit");
        try {
            return permitService.getPermit(permitId);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get permit of route")
    @GetMapping("/getpermitofroute")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public PermitModel getPermitOfRoute(@RequestParam Integer routeId) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitOfRoute");
        try {
            return permitService.getPermitOfRoute(routeId);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get permit of route bridge")
    @GetMapping("/getpermitofroutebridge")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public PermitModel getPermitOfRouteBridge(@RequestParam Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitOfRouteBridge");
        try {
            return permitService.getPermitOfRouteBridge(routeBridgeId);
        } finally {
            serviceMetric.end();
        }
    }
}
