package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariRole;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.service.CompanyService;
import fi.vaylavirasto.sillari.service.PermitService;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@Timed
@RequestMapping("/permit")
public class PermitController {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    PermitService permitService;
    @Autowired
    CompanyService companyService;
    @Autowired
    SupervisionService supervisionService;
    @Autowired
    UIService uiService;

    @Operation(summary = "Get permit")
    @GetMapping(value = "/getpermit", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public ResponseEntity<?> getPermit(@RequestParam Integer permitId) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermit");
        try {
            if (!isOwnCompanyPermit(permitId)) {
                throw new AccessDeniedException("Not user company permit.");
            }
            PermitModel permit = permitService.getPermit(permitId);
            return ResponseEntity.ok().body(permit != null ? permit : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get permit of route transport")
    @GetMapping(value = "/getpermitofroutetransport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)  || @sillariRightsChecker.isSillariKuljettaja(authentication)")
    public ResponseEntity<?> getPermitOfRouteTransport(@RequestParam Integer routeTransportId) {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitOfRouteTransport");
        try {
            if (!isOwnCompanyRouteTransport(routeTransportId)) {
                throw new AccessDeniedException("Not user company route transport.");
            }
            PermitModel permit = permitService.getPermitOfRouteTransport(routeTransportId);
            return ResponseEntity.ok().body(permit != null ? permit : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get permit pdf")
    @GetMapping(value = "/getpermitpdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariAjojarjestelija(authentication)  || @sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public void getPermitPdf(HttpServletResponse response, @RequestParam Integer id) throws IOException {
        ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitPdf");
        try {
            logger.debug("getPermitPdf: " +id);
            if (!userHasRightsToViewPermit(id)) {
                logger.warn("not userHasRightsToViewPermit");
                throw new AccessDeniedException("No right to view permit.");
            }
            PermitModel permit = permitService.getPermit(id);
            String objectKey = permit.getPdfObjectKey();
            permitService.getPermitPdf(response, objectKey);
        } finally {
            serviceMetric.end();
        }
    }

    /* Check that permit company matches ajojärjestelija- or kuljettaja-user company */
    private boolean isOwnCompanyPermit(Integer permitId) {
        CompanyModel cm = companyService.getCompanyByPermitId(permitId);
        SillariUser user = uiService.getSillariUser();
        return user.getBusinessId().equals(cm.getBusinessId());
    }

    /* Check that transport company matches ajojärjestelija- or kuljettaja-user company */
    private boolean isOwnCompanyRouteTransport(Integer routeTransportId) {
        CompanyModel cm = companyService.getCompanyByRouteTransportId(routeTransportId);
        SillariUser user = uiService.getSillariUser();
        return user.getBusinessId().equals(cm.getBusinessId());
    }

    /* Check that sillanvalvoja-user has right to view permit*/
    private boolean isPermitOfSupervisor(SillariUser user, Integer permitId) {
        List<SupervisorModel> supervisors = supervisionService.getSupervisorsByPermitId(permitId);
        return  supervisors.stream().map(s->s.getUsername()).anyMatch(u-> u.equals(user.getUsername()));
    }

    /* Check role-specifically if user has right to permit*/
    private boolean userHasRightsToViewPermit(Integer permitId) {
        if(permitId == null || permitId == 0){
            return true;
        }
        SillariUser user = uiService.getSillariUser();
        boolean hasRight = false;

        if(user.getRoles().contains(SillariRole.SILLARI_SILLANVALVOJA)){
            hasRight = isPermitOfSupervisor(user, permitId);
        }
        if(user.getRoles().contains(SillariRole.SILLARI_KULJETTAJA) || user.getRoles().contains(SillariRole.SILLARI_AJOJARJESTELIJA)){
            hasRight |= isOwnCompanyPermit(permitId);
        }
        return hasRight;
    }


}
