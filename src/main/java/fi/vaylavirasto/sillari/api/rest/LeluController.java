package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitDTO;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitsWithExcessTransportNumbersResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.permitPdf.LeluPermiPdfResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.routeGeometry.LeluRouteGeometryResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluBridgeSupervisionResponseDTO;
import fi.vaylavirasto.sillari.api.rest.error.*;
import fi.vaylavirasto.sillari.model.BridgeImageModel;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.service.BridgeImageService;
import fi.vaylavirasto.sillari.service.BridgeService;
import fi.vaylavirasto.sillari.service.LeluService;
import fi.vaylavirasto.sillari.service.trex.TRexBridgeInfoService;
import fi.vaylavirasto.sillari.service.trex.TRexPicService;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/lelu")
public class LeluController {
    private static final Logger logger = LogManager.getLogger();
    private static final String LELU_API_VERSION_HEADER_NAME = "lelu-api-accept-version";

    @Value("${sillari.lelu.version}")
    private String currentApiVersion;


    private LeluService leluService;
    private BridgeService bridgeService;
    private BridgeImageService bridgeImageService;
    private TRexBridgeInfoService trexBridgeInfoService;
    private TRexPicService tRexPicService;
    private MessageSource messageSource;

    @Autowired
    public LeluController(LeluService leluService, TRexBridgeInfoService trexBridgeInfoService, BridgeService bridgeService, BridgeImageService bridgeImageService, TRexPicService tRexPicService, MessageSource messageSource) {
        this.leluService = leluService;
        this.trexBridgeInfoService = trexBridgeInfoService;
        this.bridgeService = bridgeService;
        this.tRexPicService = tRexPicService;
        this.bridgeImageService = bridgeImageService;
        this.messageSource = messageSource;

    }

    // Handle JSON parse exceptions (thrown through @RequestBody)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleException(HttpMessageNotReadableException ex) {
        logger.warn("HttpMessageNotReadableException 'message':'{}'", ex.getMessage());
        // Get only the first segment of the message to not include nested exceptions
        String truncatedMsg = ex.getMessage() != null ? ex.getMessage().split(";")[0] : null;
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(truncatedMsg);
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


    @PostMapping(value = "/permit")
    @ResponseBody
    @Operation(summary = "Create or update permit", description = "Adds a new permit from LeLu to SillaRi. " +
            "If the same permit number is already found in SillaRi, updates that permit with the provided data. " +
            "If permit is updated, updates routes found with same LeLu ID, adds new routes and deletes routes that are no longer included in the permit. " +
            "CURRENT LIMITATIONS: 1. Bridge OID must be found in SillaRi DB, otherwise bridge is not added. " +
            "2. Updated routes must not have existing transport instances or supervisions.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200 OK", description = "Permit saved/updated"),
            @ApiResponse(responseCode = "400 BAD_REQUEST", description = "API version mismatch"),
            @ApiResponse(responseCode = "406 NOT_ACCEPTABLE", description = "Permit already exists with the same permit number and greater version number"),
            @ApiResponse(responseCode = "409 CONFLICT", description = "Permit already exists with the same permit number and version")
    })
    public ResponseEntity<LeluPermitResponseDTO> savePermit(@Valid @RequestBody LeluPermitDTO permitDTO, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException, LeluPermitSaveException {
        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            logger.debug("LeLu savePermit='number':'{}', 'version':{}", permitDTO.getNumber(), permitDTO.getVersion());
            try {
                LeluPermitResponseDTO permit = leluService.createPermit(permitDTO);

                // Get Bridges From TREX to DB
                // Update bridges from TREX in the background, so we can get the response to Lelu quicker
                ExecutorService executor = Executors.newWorkStealingPool();
                executor.submit(() -> {
                    permitDTO.getRoutes().forEach(r -> r.getBridges().forEach(b -> getBridgeFromTrexToDB(b.getOid())));
                });

                logger.debug("LeLu savePermit returning");
                return ResponseEntity.ok(permit);
            } catch (LeluPermitSaveException leluPermitSaveException) {
                logger.error(leluPermitSaveException.getMessage());
                throw leluPermitSaveException;
            } catch (Exception e) {
                logger.error(e.getMessage());
                throw new LeluPermitSaveException(HttpStatus.INTERNAL_SERVER_ERROR, messageSource.getMessage("lelu.permit.save.failed", null, Locale.ROOT) + " " + e.getClass().getName() + " " + e.getMessage());
            }
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }





    private void getBridgeFromTrexToDB(String oid) {
        logger.debug("get bridge {}", oid);
        try {
            BridgeModel bridge = trexBridgeInfoService.getBridge(oid);
            Integer bridgeId = bridgeService.createOrUpdateBridge(bridge);
            logger.debug("bridge inserted or updated: {}", bridge);
            BridgeImageModel bridgeImageModel = tRexPicService.getPicFromTrex(oid, bridgeId);
            if(bridgeImageModel != null){
                bridgeImageService.saveBridgeIntoDBAndS3(bridgeImageModel);
            }
        } catch (TRexRestException e) {
            logger.warn("Trex fail getting bridge: {}", oid, e);
        } catch (Exception e) {
            logger.error("Fail getBridgeFromTrexToDB", e);
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
            throws PDFUploadException {
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


    /**
     * Get supervision of a route.
     * Lelu uses this to poll individual supervisions
     * to see which supervision have report generated (status REPORT_SIGNED)
     * and gets the report pdf:s with /supervisionReport
     *
     * @param routeId
     * @param bridgeIdentifier
     * @param transportNumber
     * @param apiVersion
     * @return
     * @throws APIVersionException
     */
    @RequestMapping(value = "/supervision", method = RequestMethod.GET)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get bridge supervisions of a route")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200 OK", description = ""),
            @ApiResponse(responseCode = "400 BAD_REQUEST", description = "API version mismatch"),
            @ApiResponse(responseCode = "404 NOT_FOUND", description = "Route, bridge or transport not found with provided id."),
    })
    public LeluBridgeSupervisionResponseDTO getSupervision(@RequestParam Long routeId, @RequestParam String bridgeIdentifier, @RequestParam Integer transportNumber, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException, LeluRouteNotFoundException {
        logger.debug("Lelu getSupervision " + routeId);

        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            return leluService.getSupervision(routeId, bridgeIdentifier, transportNumber);
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }


    /**
     * @param apiVersion
     * @return
     * @throws APIVersionException
     */
    @RequestMapping(value = "/permitsWithExcessTransportNumbers", method = RequestMethod.GET)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Uusi rajapinta SillaRiin jota lelu pollaa 'harvoin' esim 1krt / päivä \n" +
            " - palauttaa tiedon : luvalla x reitillä y sillalla z ylitetty ylitysmäärien käyttökerrat  \n" +
            " - palauttaa listan instansseja [reitti-silta-maksimi ylityskertanumero ] jotta lelu osaa käydä hakemassa nämä ")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200 OK", description = ""),
            @ApiResponse(responseCode = "400 BAD_REQUEST", description = "API version mismatch"),
    })
    public List<LeluPermitsWithExcessTransportNumbersResponseDTO> getPermitsWithExcessTransportNumbers(@RequestParam Long routeId, @RequestParam String bridgeIdentifier, @RequestParam Integer transportNumber, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException, LeluRouteNotFoundException {
        logger.debug("Lelu getSupervision " + routeId);

        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            return leluService.getPermitsWithExcessTransportNumbers();
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }

}
