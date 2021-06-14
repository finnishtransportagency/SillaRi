package fi.vaylavirasto.sillari.service.trex;

import lombok.Data;

public @Data
class EpajatkuvuuskohdatItem {
    private Integer edeltavanJanteenNumero;
    private Pituus pituus;
    private KohtisuoraPituus kohtisuoraPituus;
}