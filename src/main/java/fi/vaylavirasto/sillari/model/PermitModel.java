package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class PermitModel {
    private long id;
    private long companyId;
    private String permitNumber;
    private String validStartDate;
    private String validEndDate;
    private Double totalMass;
    private List<RouteModel> routes;
    private List<TransportDimensionsModel> transportsDimensionss;
    private List<AxleChartModel> axleCharts;
}
