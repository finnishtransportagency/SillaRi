package fi.vaylavirasto.sillari.service.trex;

import java.util.List;

import lombok.Data;

public @Data
class Response {
    private NykyinenKunnossapitaja nykyinenKunnossapitaja;
    private List<VesivaylaosoitteetItem> vesivaylaosoitteet;
    private Rakennekorkeus rakennekorkeus;
    private HistoriallinenMerkittavyys historiallinenMerkittavyys;
    private String tunnus;
    private List<SijaintikunnatItem> sijaintikunnat;
    private Integer maaraavanJanteenNumero;
    private String oid;
    private Integer levennysvuosi;
    private Rakenneluokka rakenneluokka;
    private Boolean merivedenVaikutus;
    private NykyinenOmistaja nykyinenOmistaja;
    private Ymparistorasitus ymparistorasitus;
    private AjoradanLeveys ajoradanLeveys;
    private KannenPituus kannenPituus;
    private TienLeveys tienLeveys;
    private HyodyllinenLeveys hyodyllinenLeveys;
    private Kokonaispintaala kokonaispintaala;
    private KannenPintaala kannenPintaala;
    private List<KayttotarkoituksetItem> kayttotarkoitukset;
    private String tila;
    private String kulkukorkeudenEste;
    private String nimi;
    private Boolean kaareva;
    private Kokonaisleveys kokonaisleveys;
    private Integer valmistumisvuosi;
    private List<EpajatkuvuuskohdatItem> epajatkuvuuskohdat;
    private List<JanteetItem> janteet;
    private List<KatuosoitteetItem> katuosoitteet;
    private List<RataosoitteetItem> rataosoitteet;
    private Levennys levennys;
    private Kokonaispituus kokonaispituus;
    private List<TieosoitteetItem> tieosoitteet;
    private String paivitetty;
    private Sijaintisuunta sijaintisuunta;
    private Kulkukorkeus kulkukorkeus;
    private Keskipistesijainti keskipistesijainti;
    private Vaylanpito vaylanpito;
}