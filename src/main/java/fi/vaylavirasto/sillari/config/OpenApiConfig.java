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
                        url="https://sillaridev.testivaylapilvi.fi/",
                        description="Dev Server"
                ),
                @Server(
                        url="https://127.0.0.1:8080/",
                        description="Local Server"
                )

        }
)
public class OpenApiConfig {
}
