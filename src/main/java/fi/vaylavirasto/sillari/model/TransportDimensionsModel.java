package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class TransportDimensionsModel {
    private Integer id;
    private Integer permitId;
    private Double height;
    private Double width;
    private Double length;


}
