package fi.vaylavirasto.sillari.api.lelu;

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
    private String number;

    @NotNull
    private LocalDateTime lastModified;

    @NotNull
    private Integer permitVersion;

    @NotNull
    private LocalDateTime validFrom;

    @NotNull
    private LocalDateTime validTo;

    @NotNull
    private LeluCustomerDTO customer;

    @Valid
    @NotEmpty
    private List<LeluVehicleDTO> vehicles;

    @NotNull
    private LeluAxleChartDTO axleChart;

    @NotNull
    private Double transportTotalMass;

    @NotNull
    private LeluTransportDimensionsDTO transportDimensions;

    private String additionalDetails;

    @Valid
    @NotEmpty
    private List<LeluRouteDTO> routes;

}
