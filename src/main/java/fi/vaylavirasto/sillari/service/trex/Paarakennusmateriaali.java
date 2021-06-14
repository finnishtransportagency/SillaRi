package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Paarakennusmateriaali {

    @JsonProperty("adjektiivi")
    private String adjektiivi;

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("tunnus")
    private String tunnus;

    @JsonProperty("kuvaus")
    private String kuvaus;

    @JsonProperty("lyhenne")
    private String lyhenne;
}