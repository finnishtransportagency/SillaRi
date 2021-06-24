package fi.vaylavirasto.sillari.api.rest;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import fi.vaylavirasto.sillari.service.trex.TRexService;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJson;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("local")
@RequestMapping(value = "/devtools")
public class DevToolsController {
    private static final org.apache.logging.log4j.Logger logger = LogManager.getLogger();

    @Autowired
    TRexService tRexService;


    @RequestMapping(value = "/resttest", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public String resttest() {
        return "Hello world.";
    }


    @RequestMapping(value = "/testConnectionToTrex", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public TrexBridgeInfoResponseJson trexConnctions() {

        logger.debug("HELLO tsest connetntons");
        String returnString = "";
        TrexBridgeInfoResponseJson b = null;
        try {
            b = tRexService.getBridgeInfo("1.2.246.578.1.15.401830");
            if (b == null) {
                logger.error("trex fail  bridge null");
                return null;

            } else {
                logger.debug("success getting bridge from trex: " + b.toString());
                return b;
            }
        } catch (Exception e) {
            logger.error("trex fail " + e.getClass().getName() + " " + e.getMessage());
            return null;
        }


    }


/*    //get bridge data from trex and construct our Bridge object
    @RequestMapping(value = "/trexTest", method = RequestMethod.GET)
    public Bridge trexTest(@RequestParam(value = "tunnus") String tunnus) throws TRexRestException {
        return tRexService.getBridgeInfo(tunnus, true, true);
    }

    //return json from trex (actually only fields in our trex json model class)
    @RequestMapping(value = "/trexTestRaw", method = RequestMethod.GET)
    public String trexTestRaw(@RequestParam(value = "tunnus") String tunnus) throws TRexRestException {

        return tRexService.getBridgeInfoAndCapacityRaw(tunnus);
    }
*/


    @RequestMapping(value = "/localHardCodedBridgeInfoJson", method = RequestMethod.GET)
    public TrexBridgeInfoResponseJson trexHardInfo() {
        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);


        try {
            var a = objectMapper.readValue(trexHardString(), TrexBridgeInfoResponseJson.class);
            return a;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }


    private String trexHardString() {
        return "{\n" +
                "  \"tila\": \"kaytossa\",\n" +
                "  \"janteet\": [\n" +
                "    {\n" +
                "      \"numero\": 0,\n" +
                "      \"rakennetyypit\": [\n" +
                "        {\n" +
                "          \"kansimateriaali\": {\n" +
                "            \"nimi\": \"string\",\n" +
                "            \"tunnus\": \"string\",\n" +
                "            \"kuvaus\": \"string\",\n" +
                "            \"lyhenne\": \"string\"\n" +
                "          },\n" +
                "          \"liittyvanJanteenNumero\": 0,\n" +
                "          \"lyhenne\": \"string\",\n" +
                "          \"maareet\": [\n" +
                "            {\n" +
                "              \"nimi\": \"Eroosio\",\n" +
                "              \"tunnus\": \"001\",\n" +
                "              \"erikseen\": true,\n" +
                "              \"kuvaus\": \"string\",\n" +
                "              \"avattava\": true,\n" +
                "              \"lyhenne\": \"string\"\n" +
                "            }\n" +
                "          ],\n" +
                "          \"nimi\": \"string\",\n" +
                "          \"paarakennusmateriaali\": {\n" +
                "            \"nimi\": \"Eroosio\",\n" +
                "            \"tunnus\": \"001\",\n" +
                "            \"adjektiivi\": \"string\",\n" +
                "            \"kuvaus\": \"string\",\n" +
                "            \"lyhenne\": \"string\"\n" +
                "          },\n" +
                "          \"rakentamistapa\": {\n" +
                "            \"nimi\": \"string\",\n" +
                "            \"tunnus\": \"string\",\n" +
                "            \"kuvaus\": \"string\",\n" +
                "            \"lyhenne\": \"string\"\n" +
                "          },\n" +
                "          \"staattinenRakenne\": {\n" +
                "            \"nimi\": \"string\",\n" +
                "            \"tunnus\": \"string\",\n" +
                "            \"kuvaus\": \"string\",\n" +
                "            \"lyhenne\": \"string\"\n" +
                "          }\n" +
                "        }\n" +
                "      ],\n" +
                "      \"jannetyyppi\": {\n" +
                "        \"nimi\": \"Eroosio\",\n" +
                "        \"tunnus\": \"001\",\n" +
                "        \"kuvaus\": \"string\",\n" +
                "        \"lyhenne\": \"string\"\n" +
                "      },\n" +
                "      \"pituus\": {\n" +
                "        \"arvo\": 0,\n" +
                "        \"yksikko\": \"pas\",\n" +
                "        \"kerrannaisyksikko\": \"mega\"\n" +
                "      },\n" +
                "      \"kohtisuoraPituus\": {\n" +
                "        \"arvo\": 0,\n" +
                "        \"yksikko\": \"pas\",\n" +
                "        \"kerrannaisyksikko\": \"mega\"\n" +
                "      },\n" +
                "      \"vapaaaukko\": {\n" +
                "        \"mitta\": {\n" +
                "          \"arvo\": 0,\n" +
                "          \"yksikko\": \"pas\",\n" +
                "          \"kerrannaisyksikko\": \"mega\"\n" +
                "        },\n" +
                "        \"kohtisuoraMitta\": {\n" +
                "          \"arvo\": 0,\n" +
                "          \"yksikko\": \"pas\",\n" +
                "          \"kerrannaisyksikko\": \"mega\"\n" +
                "        },\n" +
                "        \"alikulkukorkeus\": {\n" +
                "          \"arvo\": 0,\n" +
                "          \"yksikko\": \"pas\",\n" +
                "          \"kerrannaisyksikko\": \"mega\"\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  ],\n" +
                "  \"kulkukorkeudenEste\": \"Ansaan yläpaarre\",\n" +
                "  \"maaraavanJanteenNumero\": 0,\n" +
                "  \"merivedenVaikutus\": true,\n" +
                "  \"kokonaispintaala\": {\n" +
                "    \"arvo\": 23.4,\n" +
                "    \"yksikko\": \"neliometri\"\n" +
                "  },\n" +
                "  \"hyodyllinenLeveys\": {\n" +
                "    \"minimi\": {\n" +
                "      \"arvo\": 7.25,\n" +
                "      \"yksikko\": \"metri\"\n" +
                "    },\n" +
                "    \"maksimi\": {\n" +
                "      \"arvo\": 7.3,\n" +
                "      \"yksikko\": \"metri\"\n" +
                "    }\n" +
                "  },\n" +
                "  \"kulkukorkeus\": {\n" +
                "    \"arvo\": 2.9,\n" +
                "    \"yksikko\": \"metri\"\n" +
                "  },\n" +
                "  \"nykyinenOmistaja\": {\n" +
                "    \"y-tunnus\": \"12345\",\n" +
                "    \"nimi\": \"Väylävirasto\"\n" +
                "  },\n" +
                "  \"katuosoitteet\": [\n" +
                "    {\n" +
                "      \"nimi\": \"string\",\n" +
                "      \"kunta\": {\n" +
                "        \"tunnus\": \"285\",\n" +
                "        \"nimi\": \"Kotka\"\n" +
                "      },\n" +
                "      \"sijainti\": \"oletus\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"keskipistesijainti\": {\n" +
                "    \"epsg-3067\": {\n" +
                "      \"x\": 222275,\n" +
                "      \"y\": 7020592\n" +
                "    },\n" +
                "    \"epsg-4326\": {\n" +
                "      \"lat\": 63.2067184984122,\n" +
                "      \"lon\": 21.4728801056541\n" +
                "    },\n" +
                "    \"tarkkuustaso\": {\n" +
                "      \"tunnus\": \"002\",\n" +
                "      \"nimi\": \"GPS-tieto\",\n" +
                "      \"jarjestysnumero\": 2\n" +
                "    }\n" +
                "  },\n" +
                "  \"kokonaispituus\": {\n" +
                "    \"arvo\": 22.3,\n" +
                "    \"yksikko\": \"metri\"\n" +
                "  },\n" +
                "  \"ymparistorasitus\": {\n" +
                "    \"tunnus\": \"18\",\n" +
                "    \"nimi\": \"Glykoli\"\n" +
                "  },\n" +
                "  \"tunnus\": \"H-12\",\n" +
                "  \"rataosoitteet\": [\n" +
                "    {\n" +
                "      \"ratanumero\": \"string\",\n" +
                "      \"ratakilometri\": 0,\n" +
                "      \"etaisyys\": 0,\n" +
                "      \"sijaintiraide\": \"string\",\n" +
                "      \"nimi\": \"string\",\n" +
                "      \"sijainti\": \"oletus\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"vaylanpito\": {\n" +
                "    \"tunnus\": \"TIE\",\n" +
                "    \"nimi\": \"Tieväylien pito\"\n" +
                "  },\n" +
                "  \"sijaintikunnat\": [\n" +
                "    {\n" +
                "      \"tunnus\": \"285\",\n" +
                "      \"nimi\": \"Kotka\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"historiallinenMerkittavyys\": {\n" +
                "    \"tunnus\": \"12\",\n" +
                "    \"nimi\": \"Merkittävä\"\n" +
                "  },\n" +
                "  \"tieosoitteet\": [\n" +
                "    {\n" +
                "      \"tienumero\": 0,\n" +
                "      \"tieosa\": 0,\n" +
                "      \"etaisyys\": 0,\n" +
                "      \"ajorata\": 0,\n" +
                "      \"nimi\": \"string\",\n" +
                "      \"sijainti\": \"oletus\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"nimi\": \"Raippaluodon silta\",\n" +
                "  \"kaareva\": true,\n" +
                "  \"nykyinenKunnossapitaja\": {\n" +
                "    \"y-tunnus\": \"12345\",\n" +
                "    \"nimi\": \"Väylävirasto\"\n" +
                "  },\n" +
                "  \"oid\": \"string\",\n" +
                "  \"vesivaylaosoitteet\": [\n" +
                "    {\n" +
                "      \"numero\": 0,\n" +
                "      \"nimi\": \"string\",\n" +
                "      \"sijainti\": \"alittava\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"epajatkuvuuskohdat\": [\n" +
                "    {\n" +
                "      \"edeltavanJanteenNumero\": 0,\n" +
                "      \"pituus\": {\n" +
                "        \"arvo\": 0,\n" +
                "        \"yksikko\": \"pas\",\n" +
                "        \"kerrannaisyksikko\": \"mega\"\n" +
                "      },\n" +
                "      \"kohtisuoraPituus\": {\n" +
                "        \"arvo\": 0,\n" +
                "        \"yksikko\": \"pas\",\n" +
                "        \"kerrannaisyksikko\": \"mega\"\n" +
                "      }\n" +
                "    }\n" +
                "  ],\n" +
                "  \"ajoradanLeveys\": {\n" +
                "    \"arvo\": 0,\n" +
                "    \"yksikko\": \"pas\",\n" +
                "    \"kerrannaisyksikko\": \"mega\"\n" +
                "  },\n" +
                "  \"paivitetty\": \"2018-10-01\",\n" +
                "  \"kayttotarkoitukset\": [\n" +
                "    {\n" +
                "      \"tunnus\": \"20\",\n" +
                "      \"nimi\": \"Raittisilta\",\n" +
                "      \"kuvaus\": \"Silta, joka johtaa kevyen-, traktori- yms. liikenteen tai karjan vesistön yli\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"rakennekorkeus\": {\n" +
                "    \"arvo\": 5.2,\n" +
                "    \"yksikko\": \"metri\"\n" +
                "  },\n" +
                "  \"kannenPituus\": {\n" +
                "    \"arvo\": 21.7,\n" +
                "    \"yksikko\": \"metri\"\n" +
                "  },\n" +
                "  \"rakenneluokka\": {\n" +
                "    \"tunnus\": \"S\",\n" +
                "    \"nimi\": \"Silta\"\n" +
                "  },\n" +
                "  \"sijaintisuunta\": {\n" +
                "    \"tunnus\": \"N\"\n" +
                "  },\n" +
                "  \"levennysvuosi\": 2001,\n" +
                "  \"kokonaisleveys\": {\n" +
                "    \"minimi\": {\n" +
                "      \"arvo\": 6.15,\n" +
                "      \"yksikko\": \"metri\"\n" +
                "    },\n" +
                "    \"maksimi\": {\n" +
                "      \"arvo\": 6.2,\n" +
                "      \"yksikko\": \"metri\"\n" +
                "    }\n" +
                "  },\n" +
                "  \"kannenPintaala\": {\n" +
                "    \"arvo\": 62.25,\n" +
                "    \"yksikko\": \"neliometri\"\n" +
                "  },\n" +
                "  \"tienLeveys\": {\n" +
                "    \"arvo\": 0,\n" +
                "    \"yksikko\": \"pas\",\n" +
                "    \"kerrannaisyksikko\": \"mega\"\n" +
                "  },\n" +
                "  \"levennys\": {\n" +
                "    \"arvo\": 0,\n" +
                "    \"yksikko\": \"pas\",\n" +
                "    \"kerrannaisyksikko\": \"mega\"\n" +
                "  },\n" +
                "  \"valmistumisvuosi\": 0\n" +
                "}";
    }


}
