package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class Tarkkuustaso {

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("jarjestysnumero")
    private Integer jarjestysnumero;

    @JsonProperty("tunnus")
    private String tunnus;
}