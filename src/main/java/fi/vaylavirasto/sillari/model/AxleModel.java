package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class AxleModel {
    private long id;
    private long axleChartId;
    private Integer axleNumber;
    private Double weight;
    private Double distanceToNext;
    private Double maxDistanceToNext;
}
