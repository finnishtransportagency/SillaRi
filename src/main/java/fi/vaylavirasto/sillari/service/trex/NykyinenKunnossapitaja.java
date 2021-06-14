package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NykyinenKunnossapitaja {

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("y-tunnus")
    private String yTunnus;
}