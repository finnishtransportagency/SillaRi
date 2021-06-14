package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MaareetItem {

    @JsonProperty("avattava")
    private Boolean avattava;

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("tunnus")
    private String tunnus;

    @JsonProperty("erikseen")
    private Boolean erikseen;

    @JsonProperty("kuvaus")
    private String kuvaus;

    @JsonProperty("lyhenne")
    private String lyhenne;
}