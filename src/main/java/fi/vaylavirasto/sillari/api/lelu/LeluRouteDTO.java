package fi.vaylavirasto.sillari.api.lelu;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@ToString
public class LeluRouteDTO {

    @NotNull(message = "{route.id.not.null}")
    @Schema(description = "Route ID in LeLu, needed for fetching route lines.", required = true, example = "12345")
    private Long id;

    @NotBlank(message = "{route.name.not.blank}")
    @Schema(description = "Route name describing the route", required = true, example = "Kotka - Tampere")
    private String name;

    @NotNull(message = "{route.order.not.null}")
    @Schema(description = "Order number of the route", required = true, example = "1")
    private Integer order;

    @NotNull(message = "{route.transport.count.not.null}")
    @Schema(description = "Number of crossings permitted for the route", example = "3")
    private Integer transportCount;

    @NotNull(message = "{route.alternative.route.not.null}")
    @Schema(description = "Describes if the route is used as an alternative for another route.", required = true, example = "false")
    private Boolean alternativeRoute;

    @Valid
    @NotEmpty(message = "{route.bridges.not.empty}")
    @Schema(description = "List of bridges on the route", required = true)
    private List<LeluBridgeDTO> bridges;

}
