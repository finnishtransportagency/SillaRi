package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class Pituus {

    @JsonProperty("arvo")
    private Integer arvo;

    @JsonProperty("yksikko")
    private String yksikko;

    @JsonProperty("kerrannaisyksikko")
    private String kerrannaisyksikko;
}