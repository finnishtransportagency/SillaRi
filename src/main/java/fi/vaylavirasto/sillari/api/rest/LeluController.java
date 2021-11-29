package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitDTO;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.permitPdf.LeluPermiPdfResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.routeGeometry.LeluRouteGeometryResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluRouteResponseDTO;
import fi.vaylavirasto.sillari.api.rest.error.*;
import fi.vaylavirasto.sillari.service.LeluService;
import fi.vaylavirasto.sillari.service.PermitService;
import fi.vaylavirasto.sillari.util.SemanticVersioningUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public LeluPermitResponseDTO savePermit(@Valid @RequestBody LeluPermitDTO permitDTO, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException, LeluPermitSaveException {
        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            logger.debug("LeLu savePermit='number':'{}', 'version':{}", permitDTO.getNumber(), permitDTO.getVersion());
            try {
                //TODO call non ddev version when time
                return leluService.createOrUpdatePermitDevVersion(permitDTO);
            } catch (LeluPermitSaveException leluPermitSaveException) {
                logger.error(leluPermitSaveException.getMessage());
                throw leluPermitSaveException;
            }
            catch (Exception e){
                logger.error(e.getMessage());
                throw new LeluPermitSaveException(messageSource.getMessage("lelu.permit.save.failed", null, Locale.ROOT) + " " + e.getClass().getName() + " " + e.getMessage());
            }
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }


    @PostMapping(value = "/uploadroutegeometry", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    @Operation(summary = "Uploads the route geometry to a route",
            description = "Uploads the route geometry to an existing route. File must be a geometry shapefiles (.shp, .shx, .dbf, .prj, .cst, .fix compressed to a single zip file")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "400 BAD_REQUEST", description = "File is empty."),
            @ApiResponse(responseCode = "404 NOT_FOUND", description = "Route not found with provided id."),
            @ApiResponse(responseCode = "500 INTERNAL_SERVER_ERROR", description = "Error processing route geometry file.")
    })
    public LeluRouteGeometryResponseDTO uploadRouteGeometry(@RequestParam(required = true) Long routeId,
                                                            @RequestPart("file") MultipartFile file)
        // @ApiParam(required = true, value = "Geometry shapefiles (.shp, .shx, .dbf, .prj, .cst, .fix compressed to a single zip file")
            throws LeluRouteNotFoundException, LeluRouteGeometryUploadException {
        logger.debug("Lelu uploadroutegeometry {}", routeId);
        logger.debug("FILE name:" + file.getName());
        logger.debug("FILE OriginalFilename:" + file.getOriginalFilename());
        logger.debug("FILE size:" + file.getSize());
        logger.debug("FILE contenttype:" + file.getContentType());
        return leluService.uploadRouteGeometry(routeId, file);
    }

    @PostMapping(value = "/uploadpermitpdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseBody
    @Operation(summary = "Uploads the permit pdf to a permit",
            description = "Uploads the permit pdf to an existing permit.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "400 BAD_REQUEST", description = "File is empty."),
            @ApiResponse(responseCode = "404 NOT_FOUND", description = "Permit not found with provided number and version."),
            @ApiResponse(responseCode = "500 INTERNAL_SERVER_ERROR", description = "Error uploading file.")
    })
    public LeluPermiPdfResponseDTO uploadPermitPdf(@RequestParam(required = true) String permitNumber, @RequestParam(required = true) Integer permitVersion,
                                                   @RequestPart("file") MultipartFile file)
            throws LeluPermitPdfUploadException {
        logger.debug("Lelu uploadpermitpdf {}", permitNumber);
        logger.debug("FILE name:" + file.getName());
        logger.debug("FILE OriginalFilename:" + file.getOriginalFilename());
        logger.debug("FILE size:" + file.getSize());
        logger.debug("FILE contenttype:" + file.getContentType());
        return leluService.uploadPermitPdf(permitNumber, permitVersion, file);
    }


    @RequestMapping(value = "/uploadroutegeometry2", method = RequestMethod.POST)
    @ResponseBody
    public LeluRouteGeometryResponseDTO uploadRouteGeometry2(@RequestParam Long routeId,
                                                             @RequestParam("file") MultipartFile file)
            throws LeluRouteNotFoundException, LeluRouteGeometryUploadException {
        logger.debug("Lelu uploadroutegeometry2 {}", routeId);
        return leluService.uploadRouteGeometry(routeId, file);
    }

    @RequestMapping(value = "/supervisions", method = RequestMethod.GET)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get bridge supervisions of a route")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200 OK", description = ""),
            @ApiResponse(responseCode = "400 BAD_REQUEST", description = "API version mismatch"),
    })
    public LeluRouteResponseDTO getSupervisions(@RequestParam Long routeId, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException {
        logger.debug("Lelu getSupervisionStatuses " + routeId);

        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            try {
                return null;
            } catch (Exception e) {
                logger.error(e.getMessage());
                return null;
            }
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }


    @GetMapping(value = "/supervisionReport", produces = MediaType.APPLICATION_PDF_VALUE)
    @ResponseBody
    @Operation(summary = "Get bridge supervision report pdf by report id acquired from /lelu/supervisions ")
    @ApiResponses(value = {  @ApiResponse(responseCode = "200", content = @Content(array = @ArraySchema(schema = @Schema(implementation = byte.class)))) })
    public byte[] getSupervisionReport(@RequestParam Long reportId, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException {
        logger.debug("Lelu getReport " + reportId);

        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            try {
                return null;
            } catch (Exception e) {
                logger.error(e.getMessage());
                return null;
            }
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }
}

