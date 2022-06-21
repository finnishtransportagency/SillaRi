package fi.vaylavirasto.sillari.service.trex.bridgePicInterface;

import java.util.List;

import lombok.Data;

public @Data
/*
{
    "kuvatiedot": [{
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
        }, {
            "id": 805020,
            "paakuva": {
                "totuusarvo": true
            },
            "kuvaluokka": {
                "tunnus": "Y",
                "nimi": "Yleiskuva"
            },
            "kuvaluokkatarkenne": [],
            "luotu": "2022-05-31T05:53:46.109Z",
            "muokattu": "2022-05-31T05:53:54.541Z"
        }
    ]
}
 */
class TrexPicInfoResponseJson {
    private List<KuvatiedotItem> kuvatiedot;
}