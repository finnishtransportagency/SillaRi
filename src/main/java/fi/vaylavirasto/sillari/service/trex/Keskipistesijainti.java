package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class Keskipistesijainti {

    @JsonProperty("epsg-4326")
    private Epsg4326 epsg4326;

    @JsonProperty("epsg-3067")
    private Epsg3067 epsg3067;

    @JsonProperty("tarkkuustaso")
    private Tarkkuustaso tarkkuustaso;
}