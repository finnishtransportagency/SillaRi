package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AxleModel {
    private Integer id;
    private Integer axleChartId;
    private Integer axleNumber;
    private BigDecimal weight;
    private BigDecimal distanceToNext;
    private BigDecimal maxDistanceToNext;
}
