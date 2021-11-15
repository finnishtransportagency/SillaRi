package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class PermitModel {
    private Integer id;
    private Integer companyId;
    private String permitNumber;
    private Integer leluVersion;
    private OffsetDateTime leluLastModifiedDate;
    private OffsetDateTime validStartDate;
    private OffsetDateTime validEndDate;
    private BigDecimal transportTotalMass;
    private TransportDimensionsModel transportDimensions;
    private UnloadedTransportDimensionsModel unloadedTransportDimensions;
    private String additionalDetails;
    private List<VehicleModel> vehicles;
    private AxleChartModel axleChart;
    private Long contractId;
    private List<RouteModel> routes;

    // Parent
    private CompanyModel company;
}
