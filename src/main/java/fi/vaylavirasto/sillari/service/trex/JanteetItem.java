package fi.vaylavirasto.sillari.service.trex;

import java.util.List;

import lombok.Data;

public @Data
class JanteetItem {
    private Integer numero;
    private Pituus pituus;
    private KohtisuoraPituus kohtisuoraPituus;
    private List<RakennetyypitItem> rakennetyypit;
    private Vapaaaukko vapaaaukko;
    private Jannetyyppi jannetyyppi;
}