package fi.vaylavirasto.sillari.api.rest;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import fi.vaylavirasto.sillari.api.rest.error.TRexRestException;
import fi.vaylavirasto.sillari.service.fim.FIMService;
import fi.vaylavirasto.sillari.service.fim.responseModel.GroupsType;
import fi.vaylavirasto.sillari.service.trex.TRexService;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJson;
import io.swagger.v3.oas.annotations.Operation;
import org.apache.logging.log4j.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile({"local", "dev"})
@RequestMapping(value = "/devtools")
public class DevToolsController {
    private static final org.apache.logging.log4j.Logger logger = LogManager.getLogger();

    @Autowired
    TRexService tRexService;
    @Autowired
    FIMService fimService;

    @RequestMapping(value = "/resttest", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public String resttest() {
        return "Hello world.";
    }

    @RequestMapping(value = "/testConnectionToFim", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request with constant bridge")
    public TrexBridgeInfoResponseJson testConnectionToFim() throws TRexRestException {

        logger.debug("HELLO test connections to fim");
        GroupsType g = null;
        try {
            g = fimService.getBridgeInfo("1.2.246.578.1.15.401830");
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


    @RequestMapping(value = "/testConnectionToTrex", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request with constant bridge")
    public TrexBridgeInfoResponseJson testConnectionToTrex() throws TRexRestException {

        logger.debug("HELLO test connections");
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


    @RequestMapping(value = "/trexTest", method = RequestMethod.GET)
    @Operation(summary = "Get bridge info with oid")
    public TrexBridgeInfoResponseJson trexTest(@RequestParam(value = "oid") String oid) throws TRexRestException {
        return tRexService.getBridgeInfo(oid);
    }


    //this can be set as "trex url" in local dev env so we get some bridge info for deving and testing when we don't connection to trex,
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
        return "{" +
                "    \"tila\": \"kaytossa\"," +
                "    \"janteet\": [{" +
                "            \"numero\": 1," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 60," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 39," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 10.5," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 2," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 65," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 63," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 11.4," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 3," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 70," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 68," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 14.2," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 4," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 75," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 73," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 17.2," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 5," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 95," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 92," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 20.3," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 6," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 250," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 246," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 26," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 7," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 95," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 92," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 20.2," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 8," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 75," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 73," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 17," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 9," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 70," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 68," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 13.6," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 10," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 65," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 63," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 10.5," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 11," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 60," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 58," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 7.7," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }, {" +
                "            \"numero\": 12," +
                "            \"rakennetyypit\": [{" +
                "                    \"kansimateriaali\": {" +
                "                        \"nimi\": \"Teräsbetonikantinen, liittorakenteinen\"," +
                "                        \"tunnus\": \"3\"," +
                "                        \"lyhenne\": \"bl\"" +
                "                    }," +
                "                    \"lyhenne\": \"Tvksbl\"," +
                "                    \"maareet\": [{" +
                "                            \"nimi\": \"vino\"," +
                "                            \"tunnus\": \"31\"," +
                "                            \"erikseen\": false," +
                "                            \"avattava\": false," +
                "                            \"lyhenne\": \"v\"" +
                "                        }" +
                "                    ]," +
                "                    \"nimi\": \"Teräksinen vinoköysi, teräsbetonikantinen, liittorakenteinen\"," +
                "                    \"paarakennusmateriaali\": {" +
                "                        \"nimi\": \"Teräs\"," +
                "                        \"tunnus\": \"13\"," +
                "                        \"adjektiivi\": \"Teräksinen\"," +
                "                        \"lyhenne\": \"T\"" +
                "                    }," +
                "                    \"staattinenRakenne\": {" +
                "                        \"nimi\": \"köysi\"," +
                "                        \"tunnus\": \"24\"," +
                "                        \"lyhenne\": \"ks\"" +
                "                    }" +
                "                }" +
                "            ]," +
                "            \"jannetyyppi\": {" +
                "                \"nimi\": \"Tavallinen\"," +
                "                \"tunnus\": \"11\"" +
                "            }," +
                "            \"pituus\": {" +
                "                \"arvo\": 50," +
                "                \"yksikko\": \"metri\"" +
                "            }," +
                "            \"vapaaaukko\": {" +
                "                \"mitta\": {" +
                "                    \"arvo\": 37," +
                "                    \"yksikko\": \"metri\"" +
                "                }," +
                "                \"alikulkukorkeus\": {" +
                "                    \"arvo\": 5.9," +
                "                    \"yksikko\": \"metri\"" +
                "                }" +
                "            }" +
                "        }" +
                "    ]," +
                "    \"kulkukorkeudenEste\": \"Pyloni, muodoltaan ylösalaisin oleva Y.\"," +
                "    \"maaraavanJanteenNumero\": 1," +
                "    \"merivedenVaikutus\": true," +
                "    \"kokonaispintaala\": {" +
                "        \"arvo\": 12540," +
                "        \"yksikko\": \"neliometri\"" +
                "    }," +
                "    \"hyodyllinenLeveys\": {" +
                "        \"minimi\": {" +
                "            \"arvo\": 12," +
                "            \"yksikko\": \"metri\"" +
                "        }" +
                "    }," +
                "    \"kulkukorkeus\": {" +
                "        \"arvo\": 17," +
                "        \"yksikko\": \"metri\"" +
                "    }," +
                "    \"nykyinenOmistaja\": {" +
                "        \"nimi\": \"Väylävirasto\"," +
                "        \"yTunnus\": \"1010547-1\"" +
                "    }," +
                "    \"keskipistesijainti\": {" +
                "        \"epsg3067\": {" +
                "            \"x\": 222275," +
                "            \"y\": 7020592" +
                "        }," +
                "        \"epsg4326\": {" +
                "            \"lat\": 63.2067184984122," +
                "            \"lon\": 21.4728801056541" +
                "        }" +
                "    }," +
                "    \"kokonaispituus\": {" +
                "        \"arvo\": 1045," +
                "        \"yksikko\": \"metri\"" +
                "    }," +
                "    \"ymparistorasitus\": {" +
                "        \"tunnus\": \"14\"," +
                "        \"nimi\": \"Meri\"," +
                "        \"kuvaus\": \"Meri-ilmasto\"" +
                "    }," +
                "    \"tunnus\": \"V-1997\"," +
                "    \"vaylanpito\": {" +
                "        \"tunnus\": \"TIE\"," +
                "        \"nimi\": \"Tieverkko\"" +
                "    }," +
                "    \"sijaintikunnat\": [{" +
                "            \"tunnus\": \"499\"," +
                "            \"nimi\": \"Mustasaari\"" +
                "        }" +
                "    ]," +
                "    \"historiallinenMerkittavyys\": {" +
                "        \"tunnus\": \"12\"," +
                "        \"nimi\": \"Merkittävä\"" +
                "    }," +
                "    \"tieosoitteet\": [{" +
                "            \"tienumero\": 724," +
                "            \"tieosa\": 5," +
                "            \"etaisyys\": 514," +
                "            \"ajorata\": 0," +
                "            \"nimi\": \"Vaasa-Raippaluoto\"," +
                "            \"sijainti\": \"oletus\"" +
                "        }, {" +
                "            \"tienumero\": 70724," +
                "            \"tieosa\": 707," +
                "            \"etaisyys\": 4930," +
                "            \"ajorata\": 0," +
                "            \"nimi\": \"*****\"," +
                "            \"sijainti\": \"oletus\"" +
                "        }" +
                "    ]," +
                "    \"nimi\": \"Raippaluodon silta\"," +
                "    \"kaareva\": true," +
                "    \"nykyinenKunnossapitaja\": {" +
                "        \"nimi\": \"Etelä-Pohjanmaan ELY-keskus\"" +
                "    }," +
                "    \"oid\": \"1.2.246.578.1.15.1001997\"," +
                "    \"vesivaylaosoitteet\": [{" +
                "            \"nimi\": \"POHJAN* Closing connection 0" +
                "            * TLSv1.2 (OUT), TLS alert, close notify (256):" +
                "            LAHTI / ALSKATIN SALMI\"," +
                "            \"sijainti\": \"alittava\"" +
                "        }" +
                "    ]," +
                "    \"ajoradanLeveys\": {" +
                "        \"arvo\": 7," +
                "        \"yksikko\": \"metri\"" +
                "    }," +
                "    \"paivitetty\": \"2021-11-22\"," +
                "    \"kayttotarkoitukset\": [{" +
                "            \"tunnus\": \"11\"," +
                "            \"nimi\": \"Vesistösilta\"," +
                "            \"kuvaus\": \"Vesistön ylittämiseksi rakennettu tiesilta\"" +
                "        }" +
                "    ]," +
                "    \"kannenPituus\": {" +
                "        \"arvo\": 1032.5," +
                "        \"yksikko\": \"metri\"" +
                "    }," +
                "    \"rakenneluokka\": {" +
                "        \"tunnus\": \"S\"," +
                "        \"nimi\": \"Silta\"" +
                "    }," +
                "    \"kokonaisleveys\": {" +
                "        \"minimi\": {" +
                "            \"arvo\": 12.8," +
                "            \"yksikko\": \"metri\"" +
                "        }" +
                "    }," +
                "    \"kannenPintaala\": {" +
                "        \"arvo\": 13216," +
                "        \"yksikko\": \"neliometri\"" +
                "    }," +
                "    \"tienLeveys\": {" +
                "        \"arvo\": 8.2," +
                "        \"yksikko\": \"metri\"" +
                "    }," +
                "    \"valmistumisvuosi\": 1997" +
                "}";
    }


}
