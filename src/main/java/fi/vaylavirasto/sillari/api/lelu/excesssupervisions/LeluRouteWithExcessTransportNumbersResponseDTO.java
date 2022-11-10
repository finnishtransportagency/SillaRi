package fi.vaylavirasto.sillari.api.lelu.excesssupervisions;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class LeluRouteWithExcessTransportNumbersResponseDTO {

    @Schema(description = "Route ID in LeLu, needed for fetching route lines.", required = true, example = "12345")
    private Long id;

    @Schema(description = "Route name describing the route", required = true, example = "Kotka - Tampere")
    private String name;

    @Schema(description = "Number of crossings done for the route", example = "3")
    private Integer transportCountActual;

    @Schema(description = "Number of crossings permitted for the route", example = "1")
    private Integer transportCount;

    @Schema(description = "List of bridges on the route with transport number exceeding the transport count sent from Lelu", required = true)
    private List<LeluBridgeWithExcessTransportNumbersResponseDTO> routeBridges;
}
