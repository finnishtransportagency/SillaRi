package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class VesivaylaosoitteetItem {

    @JsonProperty("numero")
    private Integer numero;

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("sijainti")
    private String sijainti;
}