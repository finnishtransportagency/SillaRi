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
@ToString(callSuper = true)
public class LeluRouteDTO {

    @NotNull
    @Schema(description = "Route ID in LeLu, needed for fetching route lines.", required = true, example = "12345")
    private Long id;

    @NotBlank
    @Schema(description = "Route name describing the route", required = true, example = "Kotka - Tampere")
    private String name;

    @NotNull
    @Schema(description = "Order number of the route", required = true, example = "1")
    private Integer order;

    @Schema(description = "Number of crossings permitted for the route", example = "3")
    private Integer transportCount;

    @NotNull
    @Schema(description = "Describes if the route is used as an alternative for another route.", required = true, example = "false")
    private Boolean alternativeRoute;

    @Valid
    @NotEmpty
    @Schema(description = "List of bridges on the route", required = true)
    private List<LeluBridgeDTO> bridges;

}
