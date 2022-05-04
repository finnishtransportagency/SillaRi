package fi.vaylavirasto.sillari.api.lelu.permit;

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

    @NotBlank(message = "{permit.number.not.blank}")
    @Schema(description = "Number identifying the permit", required = true, example = "1234/2021")
    private String number;

    @NotNull(message = "{permit.last.modified.not.null}")
    @Schema(description = "When the permit was last modified in LeLu", required = true, example = "2021-05-26T08:02:36.000Z")
    private LocalDateTime lastModifiedDate;

    @NotNull(message = "{permit.version.not.null}")
    @Schema(description = "Version number of the approved permit, starting from 1.", required = true, example = "1")
    private Integer version;

    @NotNull(message = "{permit.valid.from.not.null}")
    @Schema(description = "Permit valid starting from", required = true, example = "2021-05-26T00:00:00.000Z")
    private LocalDateTime validFrom;

    @NotNull(message = "{permit.valid.to.not.null}")
    @Schema(description = "Permit valid until", required = true, example = "2022-12-31T00:00:00.000Z")
    private LocalDateTime validTo;

    @Valid
    @NotNull(message = "{permit.customer.not.null}")
    @Schema(description = "Who the permit was granted to", required = true)
    private LeluCustomerDTO customer;

    @Valid
    @NotEmpty(message = "{permit.vehicles.not.empty}")
    @Schema(description = "List of vehicles included in the permit", required = true)
    private List<LeluVehicleDTO> vehicles;

    @Valid
    @Schema(description = "Axle chart of the transport, including all vehicles.")
    private LeluAxleChartDTO axleChart;

    @Schema(description = "Total mass of the transport, including all vehicles (t).", example = "456.7")
    private Double transportTotalMass;

    @Valid
    @NotNull(message = "{permit.transport.dimensions.not.null}")
    @Schema(description = "Max dimensions of the transport, including all vehicles.", required = true)
    private LeluTransportDimensionsDTO transportDimensions;

    @Valid
    @Schema(description = "Unloaded max dimensions of the transport, including all vehicles. Unloaded dimensions are added to the permit only when using non- EU/EEA transport equipment, so not all permits contain this information", required = false)
    private LeluUnloadedTransportDimensionsDTO unloadedTransportDimensions;

    @Schema(description = "Additional details", example = "Muita huomioita")
    private String additionalDetails;

    @Valid
    @NotEmpty(message = "{permit.routes.not.empty}")
    @Schema(description = "List of routes included in the permit", required = true)
    private List<LeluRouteDTO> routes;

    @Valid
    @Schema(description = "Authorizer for the company, 'valtuusvastaava'", required = false)
    private LeluCompanyAuthorizerDTO companyAuthorizer;

}
