package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.service.*;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    @Autowired
    OwnListService ownListService;

    @Operation(summary = "Get routes of permit")
    @GetMapping(value = "/getRoutes", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<List<RouteModel>> getRoutes(@RequestParam String permitNumber) {
        ServiceMetric serviceMetric = new ServiceMetric("AreaContractorController", "getRoutes");
        try {
            List<RouteModel> routes = permitService.getRoutes(permitNumber);
            if (routes == null) {
                return null;
            } else {
                List<RouteModel> routesWithBridges = new ArrayList<>();
                routes.forEach(r -> routesWithBridges.add(routeService.getRoute(r.getId())));
                SillariUser user = uiService.getSillariUser();
                //filter out routes that don't have any bridge with user contract business id
                return ResponseEntity.ok(routesWithBridges.stream().filter(r -> r.getRouteBridges().stream().anyMatch(b -> b.getContractBusinessId() != null && b.getContractBusinessId().equals(user.getBusinessId()))).collect(Collectors.toList()));
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

    @Operation(summary = "Add to own list")
    @GetMapping(value = "/addToOwnList", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity addToOwnList(@RequestParam List<Integer> supervisionIds) {
        ServiceMetric serviceMetric = new ServiceMetric("AreaContractorController", "addToOwnList");
        try {
            String userBusiness = uiService.getSillariUser().getBusinessId();
            supervisionIds.forEach(id -> ownListService.addToList(userBusiness, id));
        } finally {
            serviceMetric.end();
        }
        return null;
    }

    @Operation(summary = "Get own list")
    @GetMapping(value = "/getOwnList", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<List<SupervisionModel>> getOwnList() {
        ServiceMetric serviceMetric = new ServiceMetric("AreaContractorController", "getOwnList");
        try {
            String userBusiness = uiService.getSillariUser().getBusinessId();
            List<SupervisionModel> list = ownListService.getOwnList(userBusiness);
            return ResponseEntity.ok(list);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Start supervision")
    @GetMapping(value = "/startSupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity startSupervision(@RequestParam Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("AreaContractorController", "startSupervision");
        try {

            //      supervisionService.startSupervision();
        } finally {
            serviceMetric.end();
        }
        return null;
    }

}

