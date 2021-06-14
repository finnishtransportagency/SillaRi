package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Epsg4326 {

    @JsonProperty("lon")
    private Double lon;

    @JsonProperty("lat")
    private Double lat;
}