package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.model.EmptyJsonResponse;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionReportModel;
import fi.vaylavirasto.sillari.model.SupervisorModel;
import fi.vaylavirasto.sillari.service.SupervisionService;
import fi.vaylavirasto.sillari.service.UIService;
import fi.vaylavirasto.sillari.service.fim.FIMService;
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
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@RestController
@Timed
@RequestMapping("/supervision")
public class SupervisionController {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    UIService uiService;
    @Autowired
    SupervisionService supervisionService;
    @Autowired
    FIMService fimService;

    @Operation(summary = "Get supervision")
    @GetMapping(value = "/getsupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> getSupervision(@RequestParam Integer supervisionId) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "getSupervision");
        try {
            if (!isSupervisionOfSupervisor(supervisionId)) {
                throw new AccessDeniedException("Supervision not of the user");
            }
            SupervisionModel supervisionModel = supervisionService.getSupervision(supervisionId);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get supervisions of supervisor")
    @GetMapping(value = "/getsupervisionsofsupervisor", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> getSupervisionsOfSupervisor() {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "getSupervisionsOfSupervisor");
        try {
            SillariUser user = uiService.getSillariUser();
            List<SupervisionModel> supervisions = supervisionService.getSupervisionsOfSupervisor(user.getUsername());
            return ResponseEntity.ok().body(supervisions != null ? supervisions : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get supervisions of supervisor")
    @GetMapping(value = "/getsupervisionsendinglistofsupervisor", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> getSupervisionSendingListOfSupervisor() {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "getSupervisionSendingListOfSupervisor");
        try {
            SillariUser user = uiService.getSillariUser();
            List<SupervisionModel> supervisions = supervisionService.getFinishedButUnsignedSupervisions(user.getUsername());
            return ResponseEntity.ok().body(supervisions != null ? supervisions : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get supervisors")
    @GetMapping(value = "/getsupervisors", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication) || @sillariRightsChecker.isSillariAjojarjestelija(authentication)")
    public ResponseEntity<?> getSupervisors() {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "getSupervisors");
        try {
            //We need to get existing supervisors from db to get their ids.
            //Update db supervisors from FIM data; if names have changed
            List<SupervisorModel> supervisorsFromFIM = fimService.getSupervisors();
            List<SupervisorModel> supervisorsFromDb = supervisionService.getSupervisors();
            List<SupervisorModel> supervisorsFromFIMInBoth  = supervisorsFromFIM.stream().filter(s->supervisorsFromDb.stream().anyMatch(s2->s2.getUsername().equals(s.getUsername()))).collect(Collectors.toList());
            List<SupervisorModel> supervisorsFromDbInBoth  = supervisorsFromDb.stream().filter(s->supervisorsFromFIM.stream().anyMatch(s2->s2.getUsername().equals(s.getUsername()))).collect(Collectors.toList());
            setIdsFromDb(supervisorsFromDbInBoth, supervisorsFromFIM);
            insertUpdatedData(supervisorsFromFIMInBoth, supervisorsFromDbInBoth);
            return ResponseEntity.ok().body(supervisorsFromFIM != null ? supervisorsFromFIM : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    private void insertUpdatedData(List<SupervisorModel> supervisorsFromFIMInBoth, List<SupervisorModel> supervisorsFromDbInBoth) {
        for(SupervisorModel supervisorFromDb:supervisorsFromDbInBoth){
            SupervisorModel supervisorFromFIM = supervisorsFromFIMInBoth.stream().filter(s->s.getUsername().equals(supervisorFromDb.getUsername())).findFirst().orElseThrow();
            supervisorFromFIM.setId(supervisorFromDb.getId());
            supervisionService.updateSupervisor(supervisorFromFIM);
        }
    }

    private void setIdsFromDb(List<SupervisorModel> supervisorsFromDbInBoth, List<SupervisorModel> supervisorsFromFIM) {
        for (SupervisorModel supervisorFromDb :supervisorsFromDbInBoth) {
            SupervisorModel supervisorFromFIM = supervisorsFromFIM.stream().filter(s->s.getUsername().equals(supervisorFromDb.getUsername())).findFirst().orElseThrow();
            supervisorFromFIM.setId(supervisorFromDb.getId());
        }
    }

    @Operation(summary = "Update conforms to permit attribute in supervision")
    @PutMapping(value = "/updateconformstopermit", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> updateConformsToPermit(@RequestBody SupervisionModel supervision) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "updateConformsToPermit");
        try {
            if (!isSupervisionOfSupervisor(supervision.getId())) {
                throw new AccessDeniedException("Supervision not of the user");
            }
            SupervisionModel supervisionModel = supervisionService.updateConformsToPermit(supervision);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Start supervision, create supervision report")
    @PostMapping(value = "/startsupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> startSupervision(@RequestBody SupervisionReportModel report) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "startSupervision");
        try {
            if (!isSupervisionOfSupervisor(report.getSupervisionId())) {
                throw new AccessDeniedException("Supervision not of the user");
            }
            SillariUser user = uiService.getSillariUser();
            SupervisionModel supervisionModel = supervisionService.startSupervision(report, user);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Cancel supervision, delete supervision report")
    @PostMapping(value = "/cancelsupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> cancelSupervision(@RequestParam Integer supervisionId) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "cancelSupervision");
        try {
            if (!isSupervisionOfSupervisor(supervisionId)) {
                throw new AccessDeniedException("Supervision not of the user");
            }
            SillariUser user = uiService.getSillariUser();
            SupervisionModel supervisionModel = supervisionService.cancelSupervision(supervisionId, user);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Deny crossing")
    @PostMapping(value = "/denycrossing", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> denyCrossing(@RequestParam Integer supervisionId, @RequestParam String denyReason) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "denyCrossing");
        try {
            if (!isSupervisionOfSupervisor(supervisionId)) {
                throw new AccessDeniedException("Supervision not of the user");
            }
            SillariUser user = uiService.getSillariUser();
            SupervisionModel supervisionModel = supervisionService.denyCrossing(supervisionId, denyReason, user);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Finish supervision")
    @PostMapping(value = "/finishsupervision", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> finishSupervision(@RequestParam Integer supervisionId) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "finishSupervision");
        try {
            if (!isSupervisionOfSupervisor(supervisionId)) {
                throw new AccessDeniedException("Supervision not of the user");
            }
            SillariUser user = uiService.getSillariUser();
            SupervisionModel supervisionModel = supervisionService.finishSupervision(supervisionId, user);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Complete supervisions")
    @PostMapping(value = "/completesupervisions", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> completeSupervisions(@RequestParam List<Integer> supervisionIds) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "completeSupervisions");
        try {
            if (supervisionIds.stream().anyMatch(id->!isSendingListSupervisionOfSupervisor(id))){
                throw new AccessDeniedException("Supervision not of the user");
            }
            SillariUser user = uiService.getSillariUser();

            if (supervisionIds != null && !supervisionIds.isEmpty()) {
                supervisionIds.forEach(supervisionId -> supervisionService.completeSupervision(supervisionId, user));

                // Don't wait for pdf generation before returning the response
                ExecutorService executor = Executors.newWorkStealingPool();
                executor.submit(() -> supervisionIds.forEach(supervisionId -> supervisionService.createSupervisionPdf(supervisionId)));
            }

            // TODO - check if any data should be returned
            return ResponseEntity.ok().body(new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Update supervision report")
    @PutMapping(value = "/updatesupervisionreport", produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariSillanvalvoja(authentication)")
    public ResponseEntity<?> updateSupervisionReport(@RequestBody SupervisionReportModel report) {
        ServiceMetric serviceMetric = new ServiceMetric("SupervisionController", "updateSupervisionReport");
        try {
            if (!isSupervisionOfSupervisor(report.getSupervisionId())) {
                throw new AccessDeniedException("Supervision not of the user");
            }
            SupervisionModel supervisionModel = supervisionService.updateSupervisionReport(report);
            return ResponseEntity.ok().body(supervisionModel != null ? supervisionModel : new EmptyJsonResponse());
        } finally {
            serviceMetric.end();
        }
    }

    /* Check that supervision belongs to the user */
    private boolean isSupervisionOfSupervisor(Integer supervisionId) {
        SupervisionModel supervision = supervisionService.getSupervision(supervisionId);
        SillariUser user = uiService.getSillariUser();
        List<SupervisionModel> supervisionsOfSupervisor = supervisionService.getUnsignedSupervisionsBySupervisorUsername(user.getUsername());

        return supervisionsOfSupervisor.stream().anyMatch(s-> s.getId().equals(supervision.getId()));
    }

    /* Check that supervision is on the user's sending list */
    private boolean isSendingListSupervisionOfSupervisor(Integer supervisionId) {
        SupervisionModel supervision = supervisionService.getSupervision(supervisionId);
        SillariUser user = uiService.getSillariUser();
        List<SupervisionModel> supervisionsOfSupervisor = supervisionService.getFinishedButUnsignedSupervisionsNoDetails(user.getUsername());

        return supervisionsOfSupervisor.stream().anyMatch(s-> s.getId().equals(supervision.getId()));
    }

}
