package fi.vaylavirasto.sillari.service.trex.bridgePicInterface;

import lombok.Data;

/*
        {
            "kuvaluokka": {
                "tunnus": "Y",
                "nimi": "Yleiskuva"
            }
 */

public @Data
class Kuvaluokka {
    private String nimi;
    private String tunnus;
}