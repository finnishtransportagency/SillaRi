package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class Kokonaisleveys {

    @JsonProperty("minimi")
    private Minimi minimi;

    @JsonProperty("maksimi")
    private Maksimi maksimi;
}