package fi.vaylavirasto.sillari.service.trex;

import lombok.Data;

public @Data
class MaareetItem {
    private Boolean avattava;
    private String nimi;
    private String tunnus;
    private Boolean erikseen;
    private String kuvaus;
    private String lyhenne;
}