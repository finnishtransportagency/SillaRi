package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class Epsg3067 {

    @JsonProperty("x")
    private Integer X;

    @JsonProperty("y")
    private Integer Y;
}