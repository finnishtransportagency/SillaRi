package fi.vaylavirasto.sillari.api.lelu.supervision;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class LeluRouteResponseDTO {
    @Schema(description = "Route ID in LeLu.", example = "12345")
    private Long id;

    @Schema(description = "Route name describing the route", example = "Kotka - Hanko")
    private String name;

    @Schema(description = "List of bridges on the route")
    private List<LeluBridgeResponseDTO> bridges;


}
