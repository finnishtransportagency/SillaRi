package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class Kokonaispituus {

    @JsonProperty("arvo")
    private Double arvo;

    @JsonProperty("yksikko")
    private String yksikko;
}