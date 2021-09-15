package fi.vaylavirasto.sillari.api.lelu;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor

public class LeluRouteGeometryResponseDTO {
    @Schema(description = "Permit ID in SillaRi", example = "737")
    private Long routeId;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Schema(description = "Response success message", example = "Reittigeometria päivitetty lupaan")
    private String message;
}

