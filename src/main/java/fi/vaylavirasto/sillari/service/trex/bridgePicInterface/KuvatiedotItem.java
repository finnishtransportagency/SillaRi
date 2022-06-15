package fi.vaylavirasto.sillari.service.trex.bridgePicInterface;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

/*
        {
            "id": 805038,
            "paakuva": {
                "totuusarvo": false
            },
            "kuvaluokka": {
                "tunnus": "Y",
                "nimi": "Yleiskuva"
            },
            "kuvaluokkatarkenne": [],
            "luotu": "2022-05-31T05:53:03.768Z",
            "muokattu": "2022-05-31T05:53:17.564Z"
        }
 */

public @Data
class KuvatiedotItem {
    private Kuvaluokka kuvaluokka;
    private List<String> kuvaluokkatarkenne;
    private long id;
    private Paakuva paakuva;
    LocalDateTime muokattu;
    LocalDateTime luotu;
}