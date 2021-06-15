package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class RataosoitteetItem {

    @JsonProperty("sijaintiraide")
    private String sijaintiraide;

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("ratanumero")
    private String ratanumero;

    @JsonProperty("sijainti")
    private String sijainti;

    @JsonProperty("etaisyys")
    private Integer etaisyys;

    @JsonProperty("ratakilometri")
    private Integer ratakilometri;
}