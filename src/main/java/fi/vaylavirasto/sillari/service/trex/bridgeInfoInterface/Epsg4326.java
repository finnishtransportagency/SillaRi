package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class Epsg4326 {

    @JsonProperty("lon")
    private Double lon;

    @JsonProperty("lat")
    private Double lat;
}