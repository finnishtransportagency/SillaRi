package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UnloadedTransportDimensionsModel {
    private Integer id;
    private Integer permitId;
    private BigDecimal height;
    private BigDecimal width;
    private BigDecimal length;
}
