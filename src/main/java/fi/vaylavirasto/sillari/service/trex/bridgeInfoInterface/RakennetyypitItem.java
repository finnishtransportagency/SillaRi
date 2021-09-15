package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class RakennetyypitItem {

    @JsonProperty("kansimateriaali")
    private Kansimateriaali kansimateriaali;

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("maareet")
    private List<MaareetItem> maareet;

    @JsonProperty("rakentamistapa")
    private Rakentamistapa rakentamistapa;

    @JsonProperty("staattinenRakenne")
    private StaattinenRakenne staattinenRakenne;

    @JsonProperty("liittyvanJanteenNumero")
    private Integer liittyvanJanteenNumero;

    @JsonProperty("paarakennusmateriaali")
    private Paarakennusmateriaali paarakennusmateriaali;

    @JsonProperty("lyhenne")
    private String lyhenne;
}