package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.service.CompanyService;
import fi.vaylavirasto.sillari.service.RouteTransportService;
import fi.vaylavirasto.sillari.service.SupervisionService;
import fi.vaylavirasto.sillari.service.UIService;
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
    SupervisionService supervisionService;
    @Autowired
    CompanyService companyService;


    @Operation(summary = "Get route transport")
    @GetMapping(value = "/getroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
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

    @Operation(summary = "Get route transports of permit")
    @GetMapping(value = "/getroutetransportsofpermit", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public ResponseEntity<?> getRouteTransportsOfPermit(@RequestParam Integer permitId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "getRouteTransportsOfPermit");
        try {
            if (!isOwnCompanyPermit(permitId)) {
                throw new AccessDeniedException("Not own company route permit");
            }
            List<RouteTransportModel> routeTransports = routeTransportService.getRouteTransportsOfPermit(permitId, true);
            return ResponseEntity.ok().body(routeTransports != null ? routeTransports : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get route transport of supervisor, with supervisions and route data")
    @GetMapping(value = "/getroutetransportofsupervisor", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> getRouteTransportOfSupervisor(@RequestParam Integer routeTransportId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "getRouteTransportOfSupervisor");
        try {
            if (!isRouteTransportOfSupervisor(routeTransportId)) {
                throw new AccessDeniedException("Not own company route permit");
            }
            SillariUser user = uiService.getSillariUser();
            RouteTransportModel routeTransport = routeTransportService.getRouteTransportOfSupervisor(routeTransportId, user.getUsername());
            return ResponseEntity.ok().body(routeTransport != null ? routeTransport : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }



    @Operation(summary = "Create route transport")
    @PostMapping(value = "/createroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public ResponseEntity<?> createRouteTransport(@RequestBody RouteTransportModel routeTransport) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteTransportController", "createRouteTransport");
        try {
            SillariUser user = uiService.getSillariUser();

            if (!isOwnCompanyPermit(routeTransport.getRoute().getPermitId())) {
                throw new AccessDeniedException("Not own company permit for route transport");
            }
            //right transport number is in bridges; they have been filtered to those with next available transport number when fetched to ui with /getpermit
            routeTransport.setTransportNumber(routeTransport.getRoute().getRouteBridges().get(0).getTransportNumber());
            RouteTransportModel insertedRouteTransport = routeTransportService.createRouteTransport(routeTransport);

            if (routeTransport.getSupervisions() != null && insertedRouteTransport != null) {
                routeTransport.getSupervisions().forEach(supervisionModel -> {
                    supervisionModel.setRouteTransportId(insertedRouteTransport.getId());

                    if (supervisionModel.getId() != null && supervisionModel.getId() > 0) {
                        supervisionService.updateSupervision(supervisionModel);
                    } else {
                        supervisionService.createSupervision(supervisionModel, user);
                    }
                });
            }

            if (insertedRouteTransport != null) {
                RouteTransportModel routeTransportModel = routeTransportService.getRouteTransport(insertedRouteTransport.getId(), true);
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
                        supervisionService.createSupervision(supervisionModel, user);
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

    /* Check that route transport contains supervision by the supervisos */
    private boolean isRouteTransportOfSupervisor(Integer routeTransportId) {
        SillariUser user = uiService.getSillariUser();
        List<SupervisorModel> supervisors = supervisionService.getSupervisorsByRouteTransportId(routeTransportId);
        return  supervisors.stream().map(s->s.getUsername()).anyMatch(u-> u.equals(user.getUsername()));
    }

}
