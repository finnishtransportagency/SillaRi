package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Maksimi {

    @JsonProperty("arvo")
    private Double arvo;

    @JsonProperty("yksikko")
    private String yksikko;
}