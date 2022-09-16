package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.service.PermitService;
import fi.vaylavirasto.sillari.service.RouteService;
import fi.vaylavirasto.sillari.service.SupervisionService;
import fi.vaylavirasto.sillari.service.UIService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@Timed
@RequestMapping("/areaContractor")
public class AreaContractorController {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    UIService uiService;
    @Autowired
    SupervisionService supervisionService;
    @Autowired
    PermitService permitService;
    @Autowired
    RouteService routeService;

    @Operation(summary = "Get routes of permit")
    @GetMapping(value = "/getRoutes", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<List<RouteModel>> getRoutes(@RequestParam String permitNumber) {
        ServiceMetric serviceMetric = new ServiceMetric("AreaContractorController", "getRoutes");
        try {
            List<PermitModel> permitsAllVersions = permitService.getPermitAllVersionsByPermitNumber(permitNumber);
            PermitModel permitCurrentVersion = permitService.getPermitCurrentVersionByPermitNumber(permitNumber);
            if(permitCurrentVersion.getCustomerUsesSillari()) {
                throw new AccessDeniedException("Not own list allowed permit.");
            }
            List<RouteModel> routes = permitService.getRoutes(permitNumber);
            if (routes == null) {
                return null;
            } else {
                List<RouteModel> routesWithBridgesAndSupervisions = new ArrayList<>();
                routes.forEach(r -> routesWithBridgesAndSupervisions.add(routeService.getRouteWithSupervisions(r.getId())));
                SillariUser user = uiService.getSillariUser();
                //filter out routes that don't have any bridge with user contract business id
                return ResponseEntity.ok(routesWithBridgesAndSupervisions.stream().filter(r -> r.getRouteBridges().stream().anyMatch(b -> b.getContractBusinessId() != null && b.getContractBusinessId().equals(user.getBusinessId()))).collect(Collectors.toList()));
            }
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get bridges of route")
    @GetMapping(value = "/getBridges", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    /**
     * @deprecated, not needed because "/getRoutes" returns also the bridges. Maybe UI can get them from there?
     */
    @Deprecated
    public ResponseEntity<List<RouteBridgeModel>> getBridges(@RequestParam Integer routeId) {
        ServiceMetric serviceMetric = new ServiceMetric("AreaContractorController", "getBridges");
        try {
            RouteModel route = routeService.getRoute(routeId);
            List<RouteBridgeModel> bridges = route.getRouteBridges();
            SillariUser user = uiService.getSillariUser();
            bridges = bridges.stream().filter(b -> b.getContractBusinessId() != null && b.getContractBusinessId().equals(user.getBusinessId())).collect(Collectors.toList());
            return ResponseEntity.ok(bridges);
        } finally {
            serviceMetric.end();
        }
    }


    /**
     * @deprecated, not needed because SupervisionController/startSupervision
     */
    @Deprecated
    @Operation(summary = "Start supervision")
    @PostMapping(value = "/startSupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> startSupervision(@RequestParam Integer supervisionId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime startTime) {
        ServiceMetric serviceMetric = new ServiceMetric("AreaContractorController", "startSupervision");
        try {
            SupervisionReportModel reportModel = new SupervisionReportModel();
            reportModel.setSupervisionId(supervisionId);
            SupervisionModel supervisionModel = supervisionService.startSupervision(reportModel, startTime, uiService.getSillariUser());
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

}

