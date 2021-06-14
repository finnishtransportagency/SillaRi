package fi.vaylavirasto.sillari.service.trex;

import lombok.Data;

public @Data
class RataosoitteetItem {
    private String sijaintiraide;
    private String nimi;
    private String ratanumero;
    private String sijainti;
    private Integer etaisyys;
    private Integer ratakilometri;
}