package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class NykyinenKunnossapitaja {

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("y-tunnus")
    private String yTunnus;
}