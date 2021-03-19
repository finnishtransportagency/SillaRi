package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.model.TransportModel;
import fi.vaylavirasto.sillari.service.TransportService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Timed
@RequestMapping("/transports")
public class TransportController {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    TransportService transportService;

    @Operation(summary = "Get all transports")
    @GetMapping
    @RequestMapping(value = "getall", method = RequestMethod.GET)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public List<TransportModel> getTransports(@RequestParam(value = "limit", defaultValue = "10") Integer limit, Authentication authentication) {
        ServiceMetric serviceMetric = new ServiceMetric("TransportController", "getTransports");
        try {
            return this.transportService.getTransports(limit);
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get all transports")
    @GetMapping
    @RequestMapping(value = "get/{id}", method = RequestMethod.GET)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public TransportModel getTransport(@PathVariable String id, Authentication authentication) {
        ServiceMetric serviceMetric = new ServiceMetric("TransportController", "getTransport");
        try {
            return this.transportService.getTransport(Integer.valueOf(id));
        } finally {
            serviceMetric.end();
        }
    }
}
