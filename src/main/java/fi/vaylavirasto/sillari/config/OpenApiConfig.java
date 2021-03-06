package fi.vaylavirasto.sillari.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                title = "SillaRi API",
                version = "v3",
                description = "This app provides REST APIs for SillaRi Application"
        ),
        servers = {
                @Server(
                        url="https://sillaridev.testivaylapilvi.fi/api/",
                        description="Dev Server"
                ),
                @Server(
                        url="http://localhost:8080/api/",
                        description="Local Server"
                )
        }
)
public class OpenApiConfig {
}
