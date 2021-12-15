package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class Keskipistesijainti {

    @JsonProperty("epsg4326")
    private Epsg4326 epsg4326;

    @JsonProperty("epsg3067")
    private Epsg3067 epsg3067;

    @JsonProperty("tarkkuustaso")
    private Tarkkuustaso tarkkuustaso;
}