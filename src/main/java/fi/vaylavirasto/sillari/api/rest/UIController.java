package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.config.SillariConfig;
import fi.vaylavirasto.sillari.service.UIService;
import io.micrometer.core.annotation.Timed;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@Timed
@RequestMapping("/ui")
public class UIController {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private UIService uiService;

    @Autowired
    private SillariConfig sillariConfig;

    @Operation(summary = "Get background map xml")
    @GetMapping(value = "/getbackgroundmapxml", produces = MediaType.APPLICATION_XML_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getBackgroundMapXml(@RequestParam Map<String, String> params) {
        ServiceMetric serviceMetric = new ServiceMetric("UIController", "getBackgroundMapXml");

        try {
            String baseUrl = sillariConfig.getWmts().getUrl();
            String proxyHost = sillariConfig.getWmts().getProxyHost();
            Integer proxyPort = sillariConfig.getWmts().getProxyPort();

            try {
                return this.uiService.getExternalData(baseUrl, params, proxyHost, proxyPort, false);
            }
            catch (Exception ex) {
                String message = "Error getting background map xml";
                logger.error(message, ex);

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("response", message));
            }
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get geoserver layer xml")
    @GetMapping(value = "/getgeoserverlayerxml/**", produces = MediaType.APPLICATION_XML_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getGeoserverLayerXml(@RequestParam Map<String, String> params, HttpServletRequest request) {
        ServiceMetric serviceMetric = new ServiceMetric("UIController", "getGeoserverLayerXml");

        try {
            String baseUrl = sillariConfig.getGeoserver().getUrl();
            String proxyHost = sillariConfig.getGeoserver().getProxyHost();
            Integer proxyPort = sillariConfig.getGeoserver().getProxyPort();

            // In RequestMapping above, '/**' means the request URI will also include any sub-paths after 'getgeoserverlayerxml'
            // For example, the sub-path is '/gwc/service/wmts' in the URL '/api/ui/getgeoserverlayerxml/gwc/service/wmts?REQUEST=GetCapabilities'
            // Get the full URL by replacing the first part with the GeoServer URL from the config, but keeping the rest
            String extraPath = request.getRequestURI().replace("/api/ui/getgeoserverlayerxml/", "");
            String fullUrl = baseUrl + extraPath;

            try {
                return this.uiService.getExternalData(fullUrl, params, proxyHost, proxyPort, false);
            }
            catch (Exception ex) {
                String message = "Error getting geoserver data xml";
                logger.error(message, ex);

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("response", message));
            }
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get background map image")
    @GetMapping(value = "/getbackgroundmapimg", produces = MediaType.IMAGE_PNG_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getBackgroundMapImage(@RequestParam Map<String, String> params){
        ServiceMetric serviceMetric = new ServiceMetric("UIController", "getBackgroundMapImage");

        try {
            String baseUrl = sillariConfig.getWmts().getUrl();
            String proxyHost = sillariConfig.getWmts().getProxyHost();
            Integer proxyPort = sillariConfig.getWmts().getProxyPort();

            try {
                return this.uiService.getExternalData(baseUrl, params, proxyHost, proxyPort, true);
            }
            catch (Exception ex) {
                String message = "Error getting background map image";
                logger.error(message, ex);

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("response", message));
            }
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get geoserver layer image")
    @GetMapping(value = "/getgeoserverlayerimg/**", produces = MediaType.IMAGE_PNG_VALUE)
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> getGeoserverLayerImage(@RequestParam Map<String, String> params, HttpServletRequest request){
        ServiceMetric serviceMetric = new ServiceMetric("UIController", "getGeoserverLayerImage");

        try {
            String baseUrl = sillariConfig.getGeoserver().getUrl();
            String proxyHost = sillariConfig.getGeoserver().getProxyHost();
            Integer proxyPort = sillariConfig.getGeoserver().getProxyPort();

            // In RequestMapping above, '/**' means the request URI will also include any sub-paths after 'getgeoserverlayerimg'
            // For example, the sub-path is '/gwc/service/wmts' in the URL '/api/ui/getgeoserverlayerimg/gwc/service/wmts?layer=sillari%3Abridge&style=point&tilematrixset=EPSG%3A3067&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A3067%3A8&TileCol=111&TileRow=188'
            // Get the full URL by replacing the first part with the GeoServer URL from the config, but keeping the rest
            String extraPath = request.getRequestURI().replace("/api/ui/getgeoserverlayerimg/", "");
            String fullUrl = baseUrl + extraPath;

            try {
                return this.uiService.getExternalData(fullUrl, params, proxyHost, proxyPort, true);
            }
            catch (Exception ex) {
                String message = "Error getting background map image";
                logger.error(message, ex);

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("response", message));
            }
        } finally {
            serviceMetric.end();
        }
    }

    @Operation(summary = "Get user data")
    @GetMapping(value = "/userdata")
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public ResponseEntity<?> userData() {
        ServiceMetric serviceMetric = new ServiceMetric("UIController", "userData");

        try {
            SillariUser user = uiService.getSillariUser();

            HashMap<String, Object> responseBody = new HashMap<>();
            responseBody.put("username", user.getUsername());
            responseBody.put("roles", user.getRoles());
            responseBody.put("firstName", user.getFirstName());
            responseBody.put("lastName", user.getLastName());
            responseBody.put("email", user.getEmail());
            responseBody.put("phoneNumber", user.getPhoneNumber());
            responseBody.put("businessId", user.getBusinessId());
            responseBody.put("organization", user.getOrganization());

            return ResponseEntity.status(HttpStatus.OK).body(responseBody);
        } finally {
            serviceMetric.end();
        }
    }
}
