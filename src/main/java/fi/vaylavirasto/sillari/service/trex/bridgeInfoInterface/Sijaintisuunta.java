package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class Sijaintisuunta {

    @JsonProperty("tunnus")
    private String tunnus;
}