package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.model.TransportModel;
import fi.vaylavirasto.sillari.model.tables.pojos.Transport;
import fi.vaylavirasto.sillari.service.TransportService;
import io.micrometer.core.annotation.Timed;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;

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
    public List<TransportModel> getTransports(){
        return this.transportService.getTransports();
    }

    @Operation(summary = "Get all transports")
    @GetMapping
    @RequestMapping(value = "get/{id}", method = RequestMethod.GET)
    public TransportModel getTransport(@PathVariable String id) {
        return this.transportService.getTransport(Integer.valueOf(id));
    }
}
