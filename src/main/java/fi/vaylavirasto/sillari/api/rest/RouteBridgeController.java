package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariRole;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.service.CompanyService;
import fi.vaylavirasto.sillari.service.RouteBridgeService;
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
@RequestMapping("/routebridge")
public class RouteBridgeController {
    @Autowired
    RouteBridgeService routeBridgeService;
    @Autowired
    UIService uiService;
    @Autowired
    CompanyService companyService;
    @Autowired
    SupervisionService supervisionService;

    @Operation(summary = "Get route bridge")
    @GetMapping(value = "/getroutebridge", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getRouteBridge(@RequestParam Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteBridgeController", "getRouteBridge");
        if(!userHasRightsToViewRoute(routeBridgeId)){
            throw new AccessDeniedException("Viewing routebridge not allowed to the user");
        }
        try {
            RouteBridgeModel routeBridge = routeBridgeService.getRouteBridge(routeBridgeId);
            return ResponseEntity.ok().body(routeBridge != null ? routeBridge : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }
    
    

    private boolean userHasRightsToViewRoute(Integer routeBridgeId) {
        SillariUser user = uiService.getSillariUser();
        boolean hasRight = false;
        if(user.getRoles().contains(SillariRole.SILLARI_SILLANVALVOJA)){
            hasRight = isOwnSupervisedRouteBridge(user, routeBridgeId);
        }
        if(user.getRoles().contains(SillariRole.SILLARI_KULJETTAJA) || user.getRoles().contains(SillariRole.SILLARI_AJOJARJESTELIJA)){
            hasRight |= isOwnCompanyRouteBridge(user, routeBridgeId);
        }
        return hasRight;
    }




    private boolean isOwnCompanyRouteBridge(SillariUser user, Integer routeBridgeId) {
        CompanyModel cm = companyService.getCompanyByRouteBridgeId(routeBridgeId);
        return user.getBusinessId().equals(cm.getBusinessId());
    }

    private boolean isOwnSupervisedRouteBridge(SillariUser user, Integer routeBridgeId) {
        List<SupervisionModel> supervisions = supervisionService.getSupervisionsByRouteBridgeId(routeBridgeId);
        return supervisions.stream().flatMap(s-> s.getSupervisors().stream()).map(s2->s2.getUsername()).anyMatch(u-> u.equals(user.getUsername()));
    }
}
