package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariRole;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.service.CompanyService;
import fi.vaylavirasto.sillari.service.RouteService;
import fi.vaylavirasto.sillari.service.SupervisionService;
import fi.vaylavirasto.sillari.service.UIService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Timed
@RequestMapping("/route")
public class RouteController {
    @Autowired
    RouteService routeService;
    @Autowired
    CompanyService companyService;
    @Autowired
    SupervisionService supervisionService;
    @Autowired
    UIService uiService;

    @Operation(summary = "Get route")
    @GetMapping(value = "/getroute", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getRoute(@RequestParam Integer routeId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteController", "getRoute");
        try {
            if(!userHasRightsToViewRoute(routeId)){
                throw new AccessDeniedException("Viewing route not allowed to the user");
            }
            RouteModel route = routeService.getRoute(routeId);
            return ResponseEntity.ok().body(route != null ? route : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    private boolean userHasRightsToViewRoute(Integer routeId) {
        if(routeId == null || routeId == 0){
            return true;
        }
        SillariUser user = uiService.getSillariUser();
        boolean hasRight = false;

        if(user.getRoles().contains(SillariRole.SILLARI_SILLANVALVOJA)){
            hasRight = isSupervisedRouteOfSupervisor(user, routeId);
        }
        if(user.getRoles().contains(SillariRole.SILLARI_KULJETTAJA) || user.getRoles().contains(SillariRole.SILLARI_AJOJARJESTELIJA)){
            hasRight |= isOwnCompanyRoute(user, routeId);
        }
        return hasRight;
    }




    private boolean isOwnCompanyRoute(SillariUser user, Integer routeId) {
        CompanyModel cm = companyService.getCompanyByRouteId(routeId);
        return user.getBusinessId().equals(cm.getBusinessId());
    }

    private boolean isSupervisedRouteOfSupervisor(SillariUser user, Integer routeId) {
        List<SupervisionSupervisorModel> supervisors = supervisionService.getSupervisorsByRouteId(routeId);
        return  supervisors.stream().map(s->s.getUsername()).anyMatch(u-> u.equals(user.getUsername()));
    }
}
