package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class EpajatkuvuuskohdatItem {

    @JsonProperty("edeltavanJanteenNumero")
    private Integer edeltavanJanteenNumero;

    @JsonProperty("pituus")
    private Pituus pituus;

    @JsonProperty("kohtisuoraPituus")
    private KohtisuoraPituus kohtisuoraPituus;
}