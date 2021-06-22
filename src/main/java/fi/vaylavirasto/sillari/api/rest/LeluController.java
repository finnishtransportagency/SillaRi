package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.lelu.LeluPermitDTO;
import fi.vaylavirasto.sillari.api.lelu.LeluPermitResponseDTO;
import fi.vaylavirasto.sillari.api.rest.error.APIVersionException;
import fi.vaylavirasto.sillari.service.LeluService;
import fi.vaylavirasto.sillari.util.SemanticVersioningUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    private static final String LELU_API_VERSION_HEADER_NAME = "lelu-api-accept-version";

    @Value("${sillari.lelu.version}")
    private String currentApiVersion;

    private final LeluService leluService;
    private final MessageSource messageSource;

    @Autowired
    public LeluController(LeluService leluService, MessageSource messageSource) {
        this.leluService = leluService;
        this.messageSource = messageSource;
    }

    @RequestMapping(value = "/apiVersion", method = RequestMethod.GET)
    @Operation(summary = "Return currently valid API version")
    public String apiVersion() {
        return currentApiVersion;
    }

    @RequestMapping(value = "/testGet", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public String getTest() {
        logger.debug("Hello Lelu testGet!");
        return "Hello LeLu, this is SillaRi!";
    }


    @RequestMapping(value = "/testGetWithVersion", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public String getTestWithVersion(@RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException {
        logger.debug("Lelu testGet version " + apiVersion);

        if (apiVersion == null) {
            return "api version missing";
        }
        if (SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            return "api version match";
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }

    @RequestMapping(value = "/testPost", method = RequestMethod.POST)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Test basic post request", description = "Returns posted string")
    public String postTest(@RequestBody String body) {
        logger.debug("Hello Lelu testPost!");
        return "Hello LeLu! SillaRi got post: " + body;
    }

    @RequestMapping(value = "/permit", method = RequestMethod.POST)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Create or update permit", description = "Adds a new permit from LeLu to SillaRi. " +
            "If the same permit number is already found in SillaRi, updates that permit with the provided data. " +
            "If permit is updated, updates routes found with same LeLu ID, adds new routes and deletes routes that are no longer included in the permit. " +
            "CURRENT LIMITATIONS: 1. Bridge OID must be found in SillaRi DB, otherwise bridge is not added. " +
            "2. Updated routes must not have existing transport instances or supervisions.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200 OK", description = "Permit saved/updated"),
            @ApiResponse(responseCode = "400 BAD_REQUEST", description = "API version mismatch"),
    })
    public LeluPermitResponseDTO savePermit(@Valid @RequestBody LeluPermitDTO permitDTO, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException {
        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            logger.debug("LeLu savePermit='number':'{}', 'version':{}", permitDTO.getNumber(), permitDTO.getVersion());
            return leluService.createOrUpdatePermit(permitDTO);
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }

}
