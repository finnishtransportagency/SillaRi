package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.api.rest.error.TransportNumberConflictException;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.service.*;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Timed
@RequestMapping("/routetransport")
public class RouteTransportController {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    UIService uiService;
    @Autowired
    RouteTransportService routeTransportService;
    @Autowired
    RouteTransportPasswordService rtpService;
    @Autowired
    SupervisionService supervisionService;
    @Autowired
    PermitService permitService;
    @Autowired
    CompanyService companyService;


    @Operation(summary = "Get route transport")
    @GetMapping(value = "</getroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public ResponseEntity<?> getRouteTransport(@RequestParam Integer routeTransportId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "getRouteTransport");
        try {
            if (!isOwnCompanyRouteTransport(routeTransportId)) {
                throw new AccessDeniedException("Not own company route transport");
            }
            RouteTransportModel routeTransport = routeTransportService.getRouteTransport(routeTransportId, true);
            return ResponseEntity.ok().body(routeTransport != null ? routeTransport : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    /**
     * @param routeTransportId
     * @param transportCode aka usernameAndPasswordHashed
     * @return
     */
    @Operation(summary = "Check transport code of route transport")
    @GetMapping(value = "/checkTransportCode", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> checkTransportCode(@RequestParam Integer routeTransportId, @RequestParam String transportCode) {
        logger.info("usernameAndPasswordHashed aka transportCode: " + transportCode);
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "unlockRouteTransport");
        try {
            if (!isRouteTransportOfSupervisor(routeTransportId)) {
                throw new AccessDeniedException("Route transport not of the user");
            }

            if (transportCode != null) {
                SillariUser user = uiService.getSillariUser();
                boolean passwordOk = rtpService.doesTransportPasswordMatch(transportCode, user.getUsername(), routeTransportId);
                return ResponseEntity.ok().body(passwordOk);
            }
            return ResponseEntity.ok().body(false);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get route transports of permit")
    @GetMapping(value = "/getroutetransportsofpermit", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public ResponseEntity<?> getRouteTransportsOfPermit(@RequestParam Integer permitId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "getRouteTransportsOfPermit");
        try {
            if (!isOwnCompanyPermit(permitId)) {
                throw new AccessDeniedException("Not own company route permit");
            }

            List<RouteTransportModel> routeTransports = routeTransportService.getRouteTransportsOfPermit(permitId);
            return ResponseEntity.ok().body(routeTransports != null ? routeTransports : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    /**
     * @param routeTransportId
     * @param transportCode aka usernameAndPasswordHashed
     * @return
     */
    @Operation(summary = "Get route transport of supervisor, with supervisions and route data")
    @GetMapping(value = "/getroutetransportofsupervisor", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> getRouteTransportOfSupervisor(@RequestParam Integer routeTransportId, @RequestParam String transportCode) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "getRouteTransportOfSupervisor");
        try {
            if (!isRouteTransportOfSupervisor(routeTransportId)) {
                throw new AccessDeniedException("Not own company route permit");
            }
            SillariUser user = uiService.getSillariUser();
            checkTransportCodeMatches(user, routeTransportId, transportCode);
            RouteTransportModel routeTransport = routeTransportService.getRouteTransportOfSupervisor(routeTransportId, user);
            return ResponseEntity.ok().body(routeTransport != null ? routeTransport : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    private void checkTransportCodeMatches(SillariUser user, Integer routeTransportId, String transportCode) {
        if (transportCode != null) {
            boolean passwordOk = rtpService.doesTransportPasswordMatch(transportCode, user.getUsername(), routeTransportId);
            if (!passwordOk) {
                throw new AccessDeniedException("Transport code does not match");
            }
        } else {
            throw new AccessDeniedException("Transport code missing");
        }
    }

    @Operation(summary = "Create route transport")
    @PostMapping(value = "/createroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public ResponseEntity<?> createRouteTransport(@RequestBody RouteTransportModel routeTransport) throws TransportNumberConflictException {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "createRouteTransport");
        try {
            SillariUser user = uiService.getSillariUser();

            if (!isOwnCompanyPermit(routeTransport.getRoute().getPermitId())) {
                throw new AccessDeniedException("Not own company permit for route transport");
            }

            PermitModel permit = permitService.getPermit(routeTransport.getRoute().getPermitId());
            routeTransportService.checkTransportNumberValid(routeTransport, routeTransport.getRoute(), permit.getPermitNumber());

            Integer routeTransportId = routeTransportService.createRouteTransport(routeTransport);
            routeTransport.setId(routeTransportId);

            if (routeTransportId != null) {

                if (routeTransport.getTransportNumber() != null) {
                    routeTransportService.setTransportNumberUsed(routeTransport);
                } else {
                    logger.warn("No available transport numbers for routeTransport permitNumber {}, route {}. RouteTransport created without transportNumber.", permit.getPermitNumber(), routeTransport.getRoute().getName());
                }

                if (routeTransport.getSupervisions() != null) {
                    routeTransport.getSupervisions().forEach(supervisionModel -> {
                        supervisionModel.setRouteTransportId(routeTransportId);

                        if (supervisionModel.getId() != null && supervisionModel.getId() > 0) {
                            supervisionService.updateSupervision(supervisionModel);
                        } else {
                            supervisionService.createSupervision(supervisionModel, user.getUsername(), SupervisionStatusType.PLANNED);
                        }
                    });
                }
                RouteTransportModel routeTransportModel = routeTransportService.getRouteTransport(routeTransportId, true);
                return ResponseEntity.ok().body(routeTransportModel != null ? routeTransportModel : new EmptyJsonResponse());
            } else {
                return ResponseEntity.ok().body(new EmptyJsonResponse());
            }
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Update route transport")
    @PutMapping(value = "/updateroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public ResponseEntity<?> updateRouteTransport(@RequestBody RouteTransportModel routeTransport) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "updateRouteTransport");
        try {
            SillariUser user = uiService.getSillariUser();

            if (!isOwnCompanyRouteTransport(routeTransport.getId())) {
                throw new AccessDeniedException("Not own company route transport");
            }
            RouteTransportModel updatedTransportModel = routeTransportService.updateRouteTransport(routeTransport);

            if (routeTransport.getSupervisions() != null) {
                routeTransport.getSupervisions().forEach(supervisionModel -> {
                    if (supervisionModel.getId() != null && supervisionModel.getId() > 0) {
                        supervisionService.updateSupervision(supervisionModel);
                    } else {
                        supervisionService.createSupervision(supervisionModel, user.getUsername(), SupervisionStatusType.PLANNED);
                    }
                });
            }

            if (updatedTransportModel != null) {
                RouteTransportModel routeTransportModel = routeTransportService.getRouteTransport(updatedTransportModel.getId(), true);
                return ResponseEntity.ok().body(routeTransportModel != null ? routeTransportModel : new EmptyJsonResponse());
            } else {
                return ResponseEntity.ok().body(new EmptyJsonResponse());
            }
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Delete route transport")
    @DeleteMapping(value = "/deleteroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public boolean deleteRouteTransport(@RequestParam Integer routeTransportId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "updateRouteTransport");
        try {
            if (!isOwnCompanyRouteTransport(routeTransportId)) {
                throw new AccessDeniedException("Not own company route transport");
            }

            // Fetch all the route transport details including the status which is not sent
            RouteTransportModel routeTransport = routeTransportService.getRouteTransport(routeTransportId, false);

            // Only route transports with planned status can be deleted
            if (routeTransport != null && routeTransport.getCurrentStatus() != null &&
                    routeTransport.getCurrentStatus().getStatus() == TransportStatusType.PLANNED) {

                // Delete the supervision related data
                if (routeTransport.getSupervisions() != null) {
                    routeTransport.getSupervisions().forEach(supervisionModel -> {
                        if (supervisionModel.getId() != null && supervisionModel.getId() > 0) {
                            supervisionService.deleteSupervision(supervisionModel);
                        }
                    });
                }

                // Set the reserved transport number back to available
                routeTransportService.setTransportNumberAvailable(routeTransport);

                // Delete the route transport related data
                routeTransportService.deleteRouteTransport(routeTransport);

                return true;
            } else {
                return false;
            }
        } finally {
            serviceMetric.end();
        }
    }

    /* Check that transport company matches ajojärjestelija- or kuljettaja-user company */
    private boolean isOwnCompanyRouteTransport(Integer routeTransportId) {
        CompanyModel cm = companyService.getCompanyByRouteTransportId(routeTransportId);
        SillariUser user = uiService.getSillariUser();
        return user.getBusinessId().equals(cm.getBusinessId());
    }

    /* Check that permit company matches ajojärjestelija- or kuljettaja-user company */
    private boolean isOwnCompanyPermit(Integer permitId) {
        CompanyModel cm = companyService.getCompanyByPermitId(permitId);
        SillariUser user = uiService.getSillariUser();
        return user.getBusinessId().equals(cm.getBusinessId());
    }

    /* Check that route transport contains supervision by the supervisor */
    private boolean isRouteTransportOfSupervisor(Integer routeTransportId) {
        SillariUser user = uiService.getSillariUser();
        List<String> supervisors = supervisionService.getSupervisorsByRouteTransportId(routeTransportId);
        return supervisors.contains(user.getBusinessId());
    }

}
