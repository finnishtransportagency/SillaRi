package fi.vaylavirasto.sillari.api.lelu;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
public class LeluPermitDTO {

    @NotBlank
    @Schema(description = "Number identifying the permit", required = true)
    private String number;

    @NotNull
    @Schema(description = "When the permit was last modified in LeLu", required = true)
    private LocalDateTime lastModified;

    @NotNull
    @Schema(description = "Version number of the approved permit, starting from 1.", required = true)
    private Integer permitVersion;

    @NotNull
    @Schema(description = "Permit valid starting from", required = true)
    private LocalDateTime validFrom;

    @NotNull
    @Schema(description = "Permit valid until", required = true)
    private LocalDateTime validTo;

    @NotNull
    @Schema(description = "Who the permit was granted to", required = true)
    private LeluCustomerDTO customer;

    @Valid
    @NotEmpty
    @Schema(description = "List of vehicles included in the permit", required = true)
    private List<LeluVehicleDTO> vehicles;

    @NotNull
    @Schema(description = "Axle chart of the transport, including all vehicles.", required = true)
    private LeluAxleChartDTO axleChart;

    @NotNull
    @Schema(description = "Total mass of the transport, including all vehicles (t).", required = true)
    private Double transportTotalMass;

    @NotNull
    @Schema(description = "Max dimensions of the transport, including all vehicles.", required = true)
    private LeluTransportDimensionsDTO transportDimensions;

    @Schema(description = "Additional details")
    private String additionalDetails;

    @Valid
    @NotEmpty
    @Schema(description = "List of routes included in the permit", required = true)
    private List<LeluRouteDTO> routes;

}
