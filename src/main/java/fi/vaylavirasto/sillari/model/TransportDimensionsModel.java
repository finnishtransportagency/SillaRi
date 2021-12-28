package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = false)
public class TransportDimensionsModel extends BaseModel {
    private Integer id;
    private Integer permitId;
    private BigDecimal height;
    private BigDecimal width;
    private BigDecimal length;
}
