package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.CrossingInputModel;
import fi.vaylavirasto.sillari.model.CrossingModel;
import fi.vaylavirasto.sillari.service.CrossingService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
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
    @GetMapping("/getcrossing")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public CrossingModel getCrossing(@RequestParam Integer crossingId) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingController", "getCrossing");
        try {
            return crossingService.getCrossing(crossingId);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Start crossing")
    @PostMapping("/startcrossing")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public CrossingModel startCrossing(@RequestParam Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingController", "startCrossing");
        try {
            return crossingService.createCrossing(routeBridgeId);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Update crossing")
    @PutMapping("/updatecrossing")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public CrossingModel updateCrossing(@RequestBody CrossingInputModel crossingInputModel) {
        ServiceMetric serviceMetric = new ServiceMetric("CrossingController", "updateCrossing");
        try {
            return crossingService.updateCrossing(crossingInputModel);
        } finally {
            serviceMetric.end();
        }
    }
}
