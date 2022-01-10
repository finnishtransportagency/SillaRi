package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitDTO;
import fi.vaylavirasto.sillari.api.lelu.permit.LeluPermitResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.permitPdf.LeluPermiPdfResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.routeGeometry.LeluRouteGeometryResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluRouteResponseDTO;
import fi.vaylavirasto.sillari.api.rest.error.*;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.service.BridgeService;
import fi.vaylavirasto.sillari.service.LeluService;
import fi.vaylavirasto.sillari.service.SupervisionImageService;
import fi.vaylavirasto.sillari.service.SupervisionService;
import fi.vaylavirasto.sillari.service.trex.TRexService;
import fi.vaylavirasto.sillari.util.PDFGenerator;
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

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.*;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


@RestController
@RequestMapping("/lelu")
public class LeluController {
    private static final Logger logger = LogManager.getLogger();
    private static final String LELU_API_VERSION_HEADER_NAME = "lelu-api-accept-version";

    @Autowired
    PDFGenerator pdfGenerator;

    @Value("${sillari.lelu.version}")
    private String currentApiVersion;


    private final LeluService leluService;
    private final TRexService trexService;
    private final BridgeService bridgeService;
    private final MessageSource messageSource;

    @Autowired
    SupervisionService supervisionService;

    @Autowired
    SupervisionImageService supervisionImageService;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    @Autowired
    public LeluController(LeluService leluService, TRexService trexService, BridgeService bridgeService, MessageSource messageSource) {
        this.leluService = leluService;
        this.trexService = trexService;
        this.bridgeService = bridgeService;
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
                // Get Bridges From Trex To DB

                //TODO call non dev version when time
                LeluPermitResponseDTO response = leluService.createOrUpdatePermitDevVersion(permitDTO);

                //update bridges from trex in the background so we can response lelu quicker
                ExecutorService executor = Executors.newWorkStealingPool();
                executor.submit(() -> {
                    permitDTO.getRoutes().forEach(r -> r.getBridges().forEach(b -> getBridgeFromTrexToDB(b.getOid())));
                });

                logger.debug("LeLu savePermit returning");
                return response;
            } catch (LeluPermitSaveException leluPermitSaveException) {
                logger.error(leluPermitSaveException.getMessage());
                throw leluPermitSaveException;
            } catch (Exception e) {
                logger.error(e.getMessage());
                throw new LeluPermitSaveException(messageSource.getMessage("lelu.permit.save.failed", null, Locale.ROOT) + " " + e.getClass().getName() + " " + e.getMessage());
            }
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }


    private void getBridgeFromTrexToDB(String oid) {
        logger.debug("get bridge {}", oid);
        try {
            BridgeModel bridge = trexService.getBridge(oid);
            bridgeService.createOrUpdateBridge(bridge);
            logger.debug("bridge inserted or updated: {}", bridge);
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
            throws LeluPdfUploadException {
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
     * Get supervisions of a route.
     * Lelu uses this to see which supervision have report generated (status COMPLETED)
     * and gets the report pdf:s with /supervisionReport
     *
     * @param routeId
     * @param apiVersion
     * @return
     * @throws APIVersionException
     */
    @RequestMapping(value = "/supervisions", method = RequestMethod.GET)
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get bridge supervisions of a route")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200 OK", description = ""),
            @ApiResponse(responseCode = "400 BAD_REQUEST", description = "API version mismatch"),
    })
    public LeluRouteResponseDTO getSupervisions(@RequestParam Long routeId, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException {
        logger.debug("Lelu getSupervisions " + routeId);

        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            try {
                LeluRouteResponseDTO route = leluService.getWholeRoute(routeId);
                return route;
            } catch (Exception e) {
                logger.error(e.getMessage());
                return null;
            }
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }



    /**
     * get the pdf supervision report from S3 (disk on dev localhost).
     * Lelu calls this after getting SIGNED-status of a report from /supervisions.
     * The report has been generated and status set to SIGNED when  /completesupervision has happened in app
     *
     * @param response
     * @param reportId   This is actually technically supervision id but is called reportId in the lelu-interface.
     * @param apiVersion
     * @throws APIVersionException
     * @throws IOException
     */
    @GetMapping(value = "/supervisionReport", produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Get bridge supervision report pdf by report id acquired from /lelu/supervisions ")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", content = @Content(array = @ArraySchema(schema = @Schema(implementation = byte.class))))})
    public void getSupervisionReport(HttpServletResponse response, @RequestParam Long reportId, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException, IOException {
        logger.debug("Lelu getReport " + reportId);

        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitPdf");
            try {
                supervisionService.getSupervisionPdf(response, reportId);
            } finally {
                serviceMetric.end();
            }
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }


    //different way to return pdf; which is nicer?
    @GetMapping(value = "/supervisionReport2", produces = MediaType.APPLICATION_PDF_VALUE)
    @ResponseBody
    @Operation(summary = "Get bridge supervision report pdf by report id acquired from /lelu/supervisions ")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", content = @Content(array = @ArraySchema(schema = @Schema(implementation = byte.class))))})
    public byte[] getSupervisionReport2(HttpServletResponse response, @RequestParam Long reportId, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException, IOException {
        logger.debug("Lelu getReport " + reportId);

        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            ServiceMetric serviceMetric = new ServiceMetric("PermitController", "getPermitPdf");
            try {
                return supervisionService.getSupervisionPdf2(reportId);
            } finally {
                serviceMetric.end();
            }
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }

    }


    //for testing and deving; generate report for given supervision id; save to local disk or S3; retunr pdf in rst response
    @GetMapping(value = "/DEV_supervisionReport", produces = MediaType.APPLICATION_PDF_VALUE)
    @ResponseBody
    @Operation(summary = "Get bridge supervision report pdf by report id acquired from /lelu/supervisions ")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", content = @Content(array = @ArraySchema(schema = @Schema(implementation = byte.class))))})
    public byte[] createSupervisionReport(@RequestParam Long supervisionId, @RequestHeader(value = LELU_API_VERSION_HEADER_NAME, required = false) String apiVersion) throws APIVersionException {
        logger.debug("Lelu getReport " + supervisionId);

        if (apiVersion == null || SemanticVersioningUtil.legalVersion(apiVersion, currentApiVersion)) {
            try {
                SupervisionModel supervision = supervisionService.getSupervision(Math.toIntExact(supervisionId));
                supervision.setImages(supervisionImageService.getSupervisionImages(supervision.getId()));

                byte[] reportPDF = pdfGenerator.generateReportPDF(supervision, activeProfile.equals("local"));
                supervisionService.savePdf(reportPDF, supervision.getReport().getId());
                return reportPDF;
            } catch (Exception e) {
                logger.error(e.getMessage());
                logger.error(e.getClass().getName());
                return null;
            }
        } else {
            throw new APIVersionException(messageSource.getMessage("lelu.api.wrong.version", null, Locale.ROOT) + " " + apiVersion + " vs " + currentApiVersion);
        }
    }
}

