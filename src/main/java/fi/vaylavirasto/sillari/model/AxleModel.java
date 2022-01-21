package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class AxleModel extends BaseModel {
    private Integer id;
    private Integer axleChartId;
    private Integer axleNumber;
    private BigDecimal weight;
    private BigDecimal distanceToNext;
    private BigDecimal maxDistanceToNext;
}
