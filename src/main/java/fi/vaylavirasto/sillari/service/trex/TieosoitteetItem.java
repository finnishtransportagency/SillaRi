package fi.vaylavirasto.sillari.service.trex;

import lombok.Data;

public @Data
class TieosoitteetItem {
    private Integer tieosa;
    private String nimi;
    private Integer tienumero;
    private String sijainti;
    private Integer etaisyys;
    private Integer ajorata;
}