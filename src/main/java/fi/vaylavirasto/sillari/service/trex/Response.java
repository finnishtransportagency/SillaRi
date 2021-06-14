package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Response {

    @JsonProperty("nykyinenKunnossapitaja")
    private NykyinenKunnossapitaja nykyinenKunnossapitaja;

    @JsonProperty("vesivaylaosoitteet")
    private List<VesivaylaosoitteetItem> vesivaylaosoitteet;

    @JsonProperty("rakennekorkeus")
    private Rakennekorkeus rakennekorkeus;

    @JsonProperty("historiallinenMerkittavyys")
    private HistoriallinenMerkittavyys historiallinenMerkittavyys;

    @JsonProperty("tunnus")
    private String tunnus;

    @JsonProperty("sijaintikunnat")
    private List<SijaintikunnatItem> sijaintikunnat;

    @JsonProperty("maaraavanJanteenNumero")
    private Integer maaraavanJanteenNumero;

    @JsonProperty("oid")
    private String oid;

    @JsonProperty("levennysvuosi")
    private Integer levennysvuosi;

    @JsonProperty("rakenneluokka")
    private Rakenneluokka rakenneluokka;

    @JsonProperty("merivedenVaikutus")
    private Boolean merivedenVaikutus;

    @JsonProperty("nykyinenOmistaja")
    private NykyinenOmistaja nykyinenOmistaja;

    @JsonProperty("ymparistorasitus")
    private Ymparistorasitus ymparistorasitus;

    @JsonProperty("ajoradanLeveys")
    private AjoradanLeveys ajoradanLeveys;

    @JsonProperty("kannenPituus")
    private KannenPituus kannenPituus;

    @JsonProperty("tienLeveys")
    private TienLeveys tienLeveys;

    @JsonProperty("hyodyllinenLeveys")
    private HyodyllinenLeveys hyodyllinenLeveys;

    @JsonProperty("kokonaispintaala")
    private Kokonaispintaala kokonaispintaala;

    @JsonProperty("kannenPintaala")
    private KannenPintaala kannenPintaala;

    @JsonProperty("kayttotarkoitukset")
    private List<KayttotarkoituksetItem> kayttotarkoitukset;

    @JsonProperty("tila")
    private String tila;

    @JsonProperty("kulkukorkeudenEste")
    private String kulkukorkeudenEste;

    @JsonProperty("nimi")
    private String nimi;

    @JsonProperty("kaareva")
    private Boolean kaareva;

    @JsonProperty("kokonaisleveys")
    private Kokonaisleveys kokonaisleveys;

    @JsonProperty("valmistumisvuosi")
    private Integer valmistumisvuosi;

    @JsonProperty("epajatkuvuuskohdat")
    private List<EpajatkuvuuskohdatItem> epajatkuvuuskohdat;

    @JsonProperty("janteet")
    private List<JanteetItem> janteet;

    @JsonProperty("katuosoitteet")
    private List<KatuosoitteetItem> katuosoitteet;

    @JsonProperty("rataosoitteet")
    private List<RataosoitteetItem> rataosoitteet;

    @JsonProperty("levennys")
    private Levennys levennys;

    @JsonProperty("kokonaispituus")
    private Kokonaispituus kokonaispituus;

    @JsonProperty("tieosoitteet")
    private List<TieosoitteetItem> tieosoitteet;

    @JsonProperty("paivitetty")
    private String paivitetty;

    @JsonProperty("sijaintisuunta")
    private Sijaintisuunta sijaintisuunta;

    @JsonProperty("kulkukorkeus")
    private Kulkukorkeus kulkukorkeus;

    @JsonProperty("keskipistesijainti")
    private Keskipistesijainti keskipistesijainti;

    @JsonProperty("vaylanpito")
    private Vaylanpito vaylanpito;
}