package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.service.BridgeService;
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
@RequestMapping("/bridge")
public class BridgeController {
    @Autowired
    BridgeService bridgeService;

    @Operation(summary = "Get bridge")
    @GetMapping("/getbridge")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public BridgeModel getBridge(@RequestParam Integer id) {
        ServiceMetric serviceMetric = new ServiceMetric("BridgeController", "getBridge");
        try {
            return bridgeService.getBridge(id);
        } finally {
            serviceMetric.end();
        }
    }
}
