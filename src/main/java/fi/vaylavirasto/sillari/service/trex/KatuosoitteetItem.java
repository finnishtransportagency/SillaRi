package fi.vaylavirasto.sillari.service.trex;

import lombok.Data;

public @Data
class KatuosoitteetItem {
    private String nimi;
    private String sijainti;
    private Kunta kunta;
}