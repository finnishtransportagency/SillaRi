package fi.vaylavirasto.sillari.service.trex;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

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