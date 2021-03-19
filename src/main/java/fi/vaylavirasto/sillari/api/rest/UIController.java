package fi.vaylavirasto.sillari.api.rest;

import fi.vaylavirasto.sillari.api.ServiceMetric;
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
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
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
    @GetMapping
    @RequestMapping(value = "getbackgroundmapxml", method = RequestMethod.GET, produces = MediaType.APPLICATION_XML_VALUE)
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

    @Operation(summary = "Get background map image")
    @GetMapping
    @RequestMapping(value = "getbackgroundmapimg", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
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
}
