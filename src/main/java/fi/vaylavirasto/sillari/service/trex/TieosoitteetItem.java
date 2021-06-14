package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TieosoitteetItem {

    @JsonProperty("tieosa")
    private Integer tieosa;

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("tienumero")
    private Integer tienumero;

    @JsonProperty("sijainti")
    private String sijainti;

    @JsonProperty("etaisyys")
    private Integer etaisyys;

    @JsonProperty("ajorata")
    private Integer ajorata;
}