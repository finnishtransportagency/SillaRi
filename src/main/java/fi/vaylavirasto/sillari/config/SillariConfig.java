package fi.vaylavirasto.sillari.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Configuration
@ConfigurationProperties(prefix = "sillari")
@Data
public class SillariConfig {
    @NotNull
    private Wmts wmts;
    @NotNull
    private Geoserver geoserver;
    @NotNull
    private AmazonCognito amazonCognito;

    @Data
    public static class Wmts {
        @NotBlank
        private String url;
        private String proxyHost;
        private Integer proxyPort;
    }

    @Data
    public static class Geoserver {
        @NotBlank
        private String url;
        private String proxyHost;
        private Integer proxyPort;
    }

    @Data
    public static class AmazonCognito {
        private String oamIss;
        private String oamUrl;
        private String oamClientId;
        private String oamLogoutUrl;
        private String adfsIss;
        private String adfsUrl;
        private String adfsClientId;
        private String adfsLogoutUrl;
    }
}
