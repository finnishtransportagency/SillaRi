package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SijaintikunnatItem {

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("tunnus")
    private String tunnus;
}