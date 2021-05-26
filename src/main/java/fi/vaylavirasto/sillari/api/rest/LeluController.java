package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.lelu.LeluPermitDTO;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/lelu")
public class LeluController {
    private static final Logger logger = LogManager.getLogger();

    @RequestMapping(value = "/testGet", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public String getTest() {
        logger.debug("Hello Lelu testGet!");
        return "Hello LeLu, this is SillaRi!";
    }

    @RequestMapping(value = "/testPost", method = RequestMethod.POST)
    @ResponseBody
    @ResponseStatus(HttpStatus.ACCEPTED)
    @Operation(summary = "Test basic post request", description = "Returns posted string")
    public String postTest(@RequestBody String body) {
        logger.debug("Hello Lelu testPost!");
        return "Hello LeLu! SillaRi got post: " + body;
    }

    @RequestMapping(value = "/permit", method = RequestMethod.POST)
    @ResponseBody
    @ResponseStatus(HttpStatus.ACCEPTED)
    @Operation(summary = "Create or update permit", description = "Adds a new permit from LeLu to SillaRi. " +
            "If the same permit number is already found in SillaRi, updates that permit with the provided data.")
    public void savePermit(@Valid @RequestBody LeluPermitDTO body) {
        logger.debug("LeLu savePermit={}", body);
    }

}
