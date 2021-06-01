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
}
