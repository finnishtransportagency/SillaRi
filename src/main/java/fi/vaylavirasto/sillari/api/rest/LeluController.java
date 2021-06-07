package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.lelu.LeluPermitDTO;
import fi.vaylavirasto.sillari.api.rest.error.APIVersionException;
import fi.vaylavirasto.sillari.service.LeluService;
import fi.vaylavirasto.sillari.util.SemanticVersioningUtil;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Locale;


@RestController
@RequestMapping("/lelu")
public class LeluController {
    private static final Logger logger = LogManager.getLogger();
    private static final String LELU_API_VERSION_HEADER_NAME = "accept-version";

    @Value("${sillari.lelu.version}")
    private String apiVersion;

    private final LeluService leluService;
    private final MessageSource messageSource;

    @Autowired
    public LeluController(LeluService leluService, MessageSource messageSource) {
        this.leluService = leluService;
        this.messageSource = messageSource;
    }

    @RequestMapping(value = "/version", method = RequestMethod.GET)
    @Operation(summary = "Return api version")
    public String version() {
        return apiVersion;
    }

    @RequestMapping(value = "/testGet", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public String getTest() {
        logger.debug("Hello Lelu testGet!");
        return "Hello LeLu, this is SillaRi!";
    }


    @RequestMapping(value = "/testGetWithVersion", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public String getTestWithVersion(@RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String version) throws APIVersionException {
        logger.debug("Hello Lelu testGet version " + version);

        if (version == null) {
            return "Hello version missing";
        }
        if (SemanticVersioningUtil.matchesMajorVersion(version, apiVersion)) {
            return "Hello major version match";
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + version + " vs " + apiVersion);
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
            "If the same permit number is already found in SillaRi, updates that permit with the provided data. " +
            "If permit is updated, updates routes found with same LeLu ID, adds new routes and deletes routes that are no longer included in the permit. " +
            "CURRENT LIMITATIONS: 1. Bridge OID must be found in SillaRi DB, otherwise bridge is not added. " +
            "2. Updated routes must not have existing transport instances or supervisions.")
    public void savePermit(@Valid @RequestBody LeluPermitDTO permitDTO) {
        logger.debug("LeLu savePermit='number':'{}', 'version':{}", permitDTO.getNumber(), permitDTO.getVersion());
        leluService.createOrUpdatePermit(permitDTO);
    }

}
