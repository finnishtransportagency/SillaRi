package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class AxleModel {
    private long id;
    private long transportId;
    private Integer axleNumber;
    private Integer weight;
    private Double distanceToNext;
    private Double maxDistanceToNext;
}
