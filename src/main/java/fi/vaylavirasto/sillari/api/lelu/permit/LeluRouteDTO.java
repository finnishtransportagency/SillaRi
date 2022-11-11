package fi.vaylavirasto.sillari.api.lelu.permit;

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

    //@NotNull(message = "{route.order.not.null}") TODO add not null when LeLu is ready
    @Schema(description = "Order number of the route in the permit", required = true, example = "1")
    private Integer orderingNumber;

    @NotNull(message = "{route.transport.count.not.null}")
    @Schema(description = "Number of crossings permitted for the route", example = "1")
    private Integer transportCount;

    @NotNull(message = "{route.alternative.route.not.null}")
    @Schema(description = "Describes if the route is used as an alternative for another route.", required = true, example = "false")
    private Boolean alternativeRoute;

    @Valid
    @NotNull(message = "{route.bridges.not.null}")
    @Schema(description = "List of bridges on the route", required = true)
    private List<LeluBridgeDTO> bridges;

    @Valid
    @NotNull(message = "{route.departureAddress.not.null}")
    @Schema(description = "Departure address of the route.", required = true)
    private LeluAddressDTO departureAddress;

    @Valid
    @NotNull(message = "{route.arrivalAddress.not.null}")
    @Schema(description = "Arrival address of the route.", required = true)
    private LeluAddressDTO arrivalAddress;

    public LeluRouteDTO() {
    }

    public LeluRouteDTO(Long id, String name, Integer transportCount, Boolean alternativeRoute, List<LeluBridgeDTO> bridges) {
        this.id = id;
        this.name = name;
        this.transportCount = transportCount;
        this.alternativeRoute = alternativeRoute;
        this.bridges = bridges;
    }

}
