package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Pituus {

    @JsonProperty("arvo")
    private Integer arvo;

    @JsonProperty("yksikko")
    private String yksikko;

    @JsonProperty("kerrannaisyksikko")
    private String kerrannaisyksikko;
}