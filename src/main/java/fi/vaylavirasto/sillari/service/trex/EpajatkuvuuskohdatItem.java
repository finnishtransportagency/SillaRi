package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EpajatkuvuuskohdatItem {

    @JsonProperty("edeltavanJanteenNumero")
    private Integer edeltavanJanteenNumero;

    @JsonProperty("pituus")
    private Pituus pituus;

    @JsonProperty("kohtisuoraPituus")
    private KohtisuoraPituus kohtisuoraPituus;
}