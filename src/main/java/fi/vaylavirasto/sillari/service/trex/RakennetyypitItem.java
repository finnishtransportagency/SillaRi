package fi.vaylavirasto.sillari.service.trex;

import java.util.List;

import lombok.Data;

public @Data
class RakennetyypitItem {
    private Kansimateriaali kansimateriaali;
    private String nimi;
    private List<MaareetItem> maareet;
    private Rakentamistapa rakentamistapa;
    private StaattinenRakenne staattinenRakenne;
    private Integer liittyvanJanteenNumero;
    private Paarakennusmateriaali paarakennusmateriaali;
    private String lyhenne;
}