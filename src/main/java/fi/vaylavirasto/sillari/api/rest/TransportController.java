package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.model.TransportModel;
import fi.vaylavirasto.sillari.model.tables.pojos.Transport;
import fi.vaylavirasto.sillari.service.TransportService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transports")
public class TransportController {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    TransportService transportService;

    @GetMapping
    @RequestMapping("getall")
    public List<TransportModel> getTransports(){
        return this.transportService.getTransports();
    }
}
