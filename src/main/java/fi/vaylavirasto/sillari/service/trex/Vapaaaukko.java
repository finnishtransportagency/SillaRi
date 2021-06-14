package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

public @Data
class Vapaaaukko {

    @JsonProperty("mitta")
    private Mitta mitta;

    @JsonProperty("kohtisuoraMitta")
    private KohtisuoraMitta kohtisuoraMitta;

    @JsonProperty("alikulkukorkeus")
    private Alikulkukorkeus alikulkukorkeus;
}