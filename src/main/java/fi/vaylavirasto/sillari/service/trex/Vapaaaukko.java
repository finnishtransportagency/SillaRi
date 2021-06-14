package fi.vaylavirasto.sillari.service.trex;

import lombok.Data;

public @Data
class Vapaaaukko {
    private Mitta mitta;
    private KohtisuoraMitta kohtisuoraMitta;
    private Alikulkukorkeus alikulkukorkeus;
}