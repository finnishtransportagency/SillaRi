package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class PermitModel {
    private long id;
    private long companyId;
    private String permitNumber;
    private Integer leluVersion;
    private OffsetDateTime leluLastModifiedDate;
    private OffsetDateTime validStartDate;
    private OffsetDateTime validEndDate;
    private Double totalMass;
    private List<RouteModel> routes;
    private TransportDimensionsModel transportDimensions;
    private AxleChartModel axleChart;
    private List<AxleModel> axles;
}
