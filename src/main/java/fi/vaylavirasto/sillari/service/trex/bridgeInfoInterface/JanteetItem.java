package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class JanteetItem {

    @JsonProperty("numero")
    private Integer numero;

    @JsonProperty("pituus")
    private Pituus pituus;

    @JsonProperty("kohtisuoraPituus")
    private KohtisuoraPituus kohtisuoraPituus;

    @JsonProperty("rakennetyypit")
    private List<RakennetyypitItem> rakennetyypit;

    @JsonProperty("vapaaaukko")
    private Vapaaaukko vapaaaukko;

    @JsonProperty("jannetyyppi")
    private Jannetyyppi jannetyyppi;
}