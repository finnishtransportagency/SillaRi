package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class TransportDimensionsModel {
    private long id;
    private long permitId;
    private Double height;
    private Double width;
    private Double length;


}
