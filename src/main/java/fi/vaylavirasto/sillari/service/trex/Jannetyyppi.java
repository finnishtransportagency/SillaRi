package fi.vaylavirasto.sillari.service.trex;

import lombok.Data;

public @Data
class Jannetyyppi {
    private String nimi;
    private String tunnus;
    private String kuvaus;
    private String lyhenne;
}