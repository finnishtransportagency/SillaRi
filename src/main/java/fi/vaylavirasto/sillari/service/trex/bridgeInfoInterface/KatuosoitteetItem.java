package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class KatuosoitteetItem {

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("sijainti")
    private String sijainti;

    @JsonProperty("kunta")
    private Kunta kunta;
}