package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Kunta {

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("tunnus")
    private String tunnus;
}