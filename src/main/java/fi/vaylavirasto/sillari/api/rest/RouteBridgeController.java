package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariRole;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.service.*;
import fi.vaylavirasto.sillari.service.trex.TRexPicService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@Timed
@RequestMapping("/routebridge")
public class RouteBridgeController {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    RouteBridgeService routeBridgeService;
    @Autowired
    UIService uiService;
    @Autowired
    CompanyService companyService;
    @Autowired
    SupervisionService supervisionService;
    @Autowired
    BridgeImageService bridgeImageService;

    @Operation(summary = "Get route bridge")
    @GetMapping(value = "/getroutebridge", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getRouteBridge(@RequestParam Integer routeBridgeId) {
        ServiceMetric serviceMetric = new ServiceMetric("RouteBridgeController", "getRouteBridge");
        try {
            if (!userHasRightsToViewRouteBridge(routeBridgeId)) {
                throw new AccessDeniedException("Viewing routebridge not allowed to the user");
            }
            RouteBridgeModel routeBridge = routeBridgeService.getRouteBridge(routeBridgeId);
            return ResponseEntity.ok().body(routeBridge != null ? routeBridge : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get bridge image")
    @GetMapping("/getBridgeImage")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public void getImage(HttpServletResponse response, @RequestParam Integer routeBridgeId) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("RouteBridgeController", "getImage");
        try {
            if (!userHasRightsToViewRouteBridge(routeBridgeId)) {
                throw new AccessDeniedException("Viewing routebridge not allowed to the user");
            }

            RouteBridgeModel routeBridge = routeBridgeService.getRouteBridge(routeBridgeId);
            if (routeBridge != null) {
                BridgeImageModel bridgeImageModel = bridgeImageService.getBridgeImage(routeBridge.getBridgeId());
                if (bridgeImageModel != null) {
                    // Get the file from S3 bucket or local file system and write to response
                    bridgeImageService.getImageFile(response, bridgeImageModel);
                } else {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found.");
                }
            }
        } finally {
            serviceMetric.end();
        }
    }


    private boolean userHasRightsToViewRouteBridge(Integer routeBridgeId) {
        if (routeBridgeId == null || routeBridgeId == 0) {
            return true;
        }
        SillariUser user = uiService.getSillariUser();
        boolean hasRight = false;

        if (user.getRoles().contains(SillariRole.SILLARI_SILLANVALVOJA)) {
            hasRight = isRouteBridgeOfSupervisor(user, routeBridgeId);
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

    private boolean isRouteBridgeOfSupervisor(SillariUser user, Integer routeBridgeId) {
        List<String> supervisors = supervisionService.getSupervisorsByRouteBridgeId(routeBridgeId);
        return supervisors.contains(user.getBusinessId());
    }
}
