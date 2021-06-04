package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.lelu.LeluPermitDTO;
import fi.vaylavirasto.sillari.api.rest.error.APIVersionException;
import fi.vaylavirasto.sillari.service.LeluService;
import fi.vaylavirasto.sillari.util.SemanticVersioningUtil;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Locale;


@RestController
@RequestMapping("/lelu")
public class LeluController {
    private static final Logger logger = LogManager.getLogger();
    private static final String LELU_API_VERSION ="1.1.0";
    private static final String LELU_API_VERSION_HEADER_NAME ="accept-version";
    private final LeluService leluService;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    public LeluController(LeluService leluService) {
        this.leluService = leluService;
    }


    @RequestMapping(value = "/version", method = RequestMethod.GET)
    @Operation(summary = "Return api version")
    public String version() {
        return LELU_API_VERSION;
    }

    @RequestMapping(value = "/testGet", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public String getTest() {
        logger.debug("Hello Lelu testGet!");
        return "Hello LeLu, this is SillaRi!";
    }


    @RequestMapping(value = "/testGetWithVersion", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public String getTestWithVersion(@RequestHeader(value=LELU_API_VERSION_HEADER_NAME,required = false) String version) throws APIVersionException {
        logger.debug("Hello Lelu testGet version " + version);
        if(version == null){
            return "Hello version missing";
        }
        if(SemanticVersioningUtil.matchesMajorVersion(version, LELU_API_VERSION)) {
            return "Hello major version match";
        }
        else{
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + version + " vs " + LELU_API_VERSION );
        }
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
    public void savePermit(@Valid @RequestBody LeluPermitDTO permitDTO) {
        logger.debug("LeLu savePermit='number':'{}', 'version':{}", permitDTO.getNumber(), permitDTO.getVersion());
        leluService.createOrUpdatePermit(permitDTO);
    }

}
