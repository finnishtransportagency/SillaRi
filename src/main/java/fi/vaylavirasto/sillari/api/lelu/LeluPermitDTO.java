package fi.vaylavirasto.sillari.api.lelu;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString(callSuper = true)
public class LeluPermitDTO {

    private String number;
    private LocalDateTime lastModified;
    private Integer permitVersion;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private LeluCustomerDTO customer;
    private List<LeluVehicleDTO> vehicles;
    private LeluAxleChartDTO axleChart;
    private Double transportTotalMass;
    private LeluTransportDimensionsDTO transportDimensions;
    private String additionalDetails;
    private List<LeluRouteDTO> routes;
}
