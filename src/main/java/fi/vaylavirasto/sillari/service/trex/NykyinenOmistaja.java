package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NykyinenOmistaja {

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("y-tunnus")
    private String yTunnus;
}