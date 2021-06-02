package fi.vaylavirasto.sillari.model;

import lombok.Data;

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
    private Double transportTotalMass;
    private TransportDimensionsModel transportDimensions;
    private String additionalDetails;
    private List<VehicleModel> vehicles;
    private AxleChartModel axleChart;
    private List<RouteModel> routes;

    // For mapping purposes only
    private CompanyModel company;
    private List<AxleModel> axles;
}
