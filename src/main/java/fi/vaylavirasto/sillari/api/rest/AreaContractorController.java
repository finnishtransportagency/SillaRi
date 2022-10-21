package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.service.*;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    @Autowired
    RouteBridgeService routeBridgeService;

    @Operation(summary = "Get routes of permit, if the permit is customerUsesSillari = false")
    @GetMapping(value = "/getRoutes", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200 OK", description = "Routes returned"),
            @ApiResponse(responseCode = "404 NOT_FOUND", description = "Permit not found with given number"),
            @ApiResponse(responseCode = "403 FORBIDDEN", description = "Permit with given number is not customerUsesSillari = false")
    })
    public ResponseEntity<List<RouteModel>> getRoutes(@Parameter(name = "permitNumber", description = "The Lelu number (string) identifier of permit", example = "1111/2022") @RequestParam String permitNumber) {
        ServiceMetric serviceMetric = new ServiceMetric("AreaContractorController", "getRoutes");
        try {
            PermitModel permitCurrentVersion = permitService.getPermitCurrentVersionByPermitNumber(permitNumber);
            if (permitCurrentVersion == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find resource");
            }
            if (permitCurrentVersion.getCustomerUsesSillari()) {
                throw new AccessDeniedException("Not own list allowed permit.");
            }
            SillariUser user = uiService.getSillariUser();
            List<RouteModel> routes = permitService.getRoutesForOwnList(permitNumber, user);
            return ResponseEntity.ok(routes != null ? routes : new ArrayList<>());

        } finally {
            serviceMetric.end();
        }
    }


    private Integer doInitiateSupervisionId(@RequestParam Integer routeBridgeTemplateId) {
        logger.debug("doInitiateSupervision " + routeBridgeTemplateId);
        SillariUser user = uiService.getSillariUser();
        if (!isOwnCompanyContractRouteBridge(user, routeBridgeTemplateId)) {
            throw new AccessDeniedException("Supervision of routebridge not allowed to the user");
        }
        String contractBusinessId = user.getBusinessId();

        Integer supervisionId = supervisionService.createAreaContractorOwnListPlannedSupervision(routeBridgeTemplateId, contractBusinessId);
        return supervisionId;

    }

    private SupervisionModel doInitiateSupervision(@RequestParam Integer routeBridgeTemplateId) {
        logger.debug("doInitiateSupervision " + routeBridgeTemplateId);
        SillariUser user = uiService.getSillariUser();
        if (!isOwnCompanyContractRouteBridge(user, routeBridgeTemplateId)) {
            throw new AccessDeniedException("Supervision of routebridge not allowed to the user");
        }
        String contractBusinessId = user.getBusinessId();

        Integer supervisionId = supervisionService.createAreaContractorOwnListPlannedSupervision(routeBridgeTemplateId, contractBusinessId);
        return supervisionService.getSupervision(supervisionId);

    }

    @Operation(summary = "Initiate own list supervision. This is to be called from UI when bridge is added to the own list. A supervision object is created and its' id is returned.")
    @PostMapping(value = "/initiateSupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200 OK", description = "Supervision initiated"),
            @ApiResponse(responseCode = "404 NOT_FOUND", description = "Route bridge template not found with given id")
    })
    @Deprecated
    public ResponseEntity<?> initiateSupervision(@RequestParam Integer routeBridgeTemplateId) {
        ServiceMetric serviceMetric = new ServiceMetric("AreaContractorController", "startSupervision");
        try {
            var supervisionId = doInitiateSupervisionId(routeBridgeTemplateId);
            return ResponseEntity.ok().body(supervisionId != null ? supervisionId : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Initiate own list supervisions. This is to be called from UI when bridge is added to the own list. A supervision object is created and its' id is returned.")
    @GetMapping(value = "/initiateSupervisions", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200 OK", description = "Supervision initiated"),
            @ApiResponse(responseCode = "404 NOT_FOUND", description = "Route bridge template not found with given id")
    })
    public ResponseEntity<?> initiateSupervisions(@RequestParam String routeBridgeTemplateIds) {
        ServiceMetric serviceMetric = new ServiceMetric("AreaContractorController", "initiateSupervisions");
        try {
            ArrayList<SupervisionModel> supervisions = new ArrayList<>();
            if(routeBridgeTemplateIds == null || routeBridgeTemplateIds.isEmpty()){
                return ResponseEntity.ok().body(supervisions);
            }
            String routeBridgeTemplateIdsWithoutBrackets = routeBridgeTemplateIds.substring(1, routeBridgeTemplateIds.length()-1);
            String[] routeBridgeTemplateIdsArray = routeBridgeTemplateIdsWithoutBrackets.split(",");
            for (String routeBridgeTemplateId : routeBridgeTemplateIdsArray) {
                SupervisionModel supervision = doInitiateSupervision(Integer.valueOf(routeBridgeTemplateId));
                supervisions.add(supervision);
            }
            return ResponseEntity.ok().body(supervisions);
        } finally {
            serviceMetric.end();
        }
    }

    private boolean isOwnCompanyContractRouteBridge(SillariUser user, Integer routeBridgeId) {
        RouteBridgeModel routeBridge = routeBridgeService.getRouteBridge(routeBridgeId);
        return user.getBusinessId().equals(routeBridge.getContractBusinessId());
    }

}

