package fi.vaylavirasto.sillari.api.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import fi.vaylavirasto.sillari.api.rest.error.TRexRestException;
import fi.vaylavirasto.sillari.service.fim.FIMService;
import fi.vaylavirasto.sillari.service.fim.responseModel.Groups;
import fi.vaylavirasto.sillari.service.fim.responseModel.SimpleBean;
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

    @RequestMapping(value = "/testGetSupervisorsRawFromFim", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request with constant bridge")
    public Groups testConnectionToFim() throws TRexRestException {

        logger.debug("HELLO test connections to fim");
        Groups g = null;
        try {
            Groups groups = fimService.getSupervisorsXML();
            if (groups == null) {
                logger.error("trex fail  bridge null");
                return null;

            } else {
                logger.debug("success getting bridge from trex: " + groups.toString());
                return groups;
            }
        } catch (Exception e) {
            logger.error("fimrest fail " + e.getClass().getName() + " " + e.getMessage());
            return null;
        }


    }


    //this can be set as "trex url" in local dev env so we get some bridge info for deving and testing when we don't connection to trex,
    @RequestMapping(value = "/localHardCodedSimpleTesttttt", method = RequestMethod.GET)
    public Groups simpleHardInfo() {
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
        try {
            SimpleBean value
                    = xmlMapper.readValue("<SimpleBean><x>5</x><y>6</y><abc>sdjgh</abc><beanToo><cde>1dg2jg134</cde></beanToo><beanToo><cde>dg2134</cde></beanToo></SimpleBean>", SimpleBean.class);
            logger.debug("hello: " + value.toString());
        /*GroupsType value
                = null;

            value = xmlMapper.readValue(fimHardString(), GroupsType.class);
        */
        } catch (JsonProcessingException e) {

            e.printStackTrace();
        }
        return null;
    }

    //this can be set as "trex url" in local dev env so we get some bridge info for deving and testing when we don't connection to trex,
    @RequestMapping(value = "/localHardCodedSimpleTesttttt2", method = RequestMethod.GET)
    public Groups simpleHardInfo2() {
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
        try {
            SimpleBean value
                    = xmlMapper.readValue("<SimpleBean><X>5</X><y>6</y><abc>sdjgh</abc><BeanToo><cde>1dg2jg134</cde></BeanToo><BeanToo><cde>dg2134</cde></BeanToo></SimpleBean>", SimpleBean.class);
            logger.debug("hello: " + value.toString());
        /*GroupsType value
                = null;

            value = xmlMapper.readValue(fimHardString(), GroupsType.class);
        */
        } catch (JsonProcessingException e) {

            e.printStackTrace();
        }
        return null;
    }

    //this can be set as "trex url" in local dev env so we get some bridge info for deving and testing when we don't connection to trex,
    @RequestMapping(value = "/localHardCodedSupervisors", method = RequestMethod.GET)
    public Groups fimHardInfo() {
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
        try {
            Groups value
                    = null;

            value = xmlMapper.readValue(fimHardString(), Groups.class);
            logger.debug("hello: " + value);
            return value;

        } catch (JsonProcessingException e) {

            e.printStackTrace();
        }
        return null;
    }

    private String fimHardString() {
        return "<groups>\n" +
                "    <group>\n" +
                "        <ObjectKey>11274699</ObjectKey>\n" +
                "        <ObjectID>46bccf6c-e36f-4cb3-9a8e-69bb3182c2c4</ObjectID>\n" +
                "        <DisplayName>sillari_sillanvalvoja</DisplayName>\n" +
                "        <persons>\n" +
                "            <person>\n" +
                "                <ObjectKey>10364038</ObjectKey>\n" +
                "                <ObjectID>2fe11aa0-da22-483f-b676-95877d1426db</ObjectID>\n" +
                "                <AccountName>LX067415</AccountName>\n" +
                "                <DisplayName>Sillari Testi1 Testi Kuljetusyritys Oy</DisplayName>\n" +
                "                <FirstName>Testi1</FirstName>\n" +
                "                <LastName>Sillari</LastName>\n" +
                "                <Email>janne.upla@cgi.com4</Email>\n" +
                "                <Yksikko/>\n" +
                "                <Department/>\n" +
                "            </person>\n" +
                "            <person>\n" +
                "                <ObjectKey>10364060</ObjectKey>\n" +
                "                <ObjectID>dc435118-7949-4ae4-85e0-6d5a8ece4a48</ObjectID>\n" +
                "                <AccountName>LX790081</AccountName>\n" +
                "                <DisplayName>Sillari Testi2 Testi Kuljetusyritys Oy</DisplayName>\n" +
                "                <FirstName>Testi2</FirstName>\n" +
                "                <LastName>Sillari</LastName>\n" +
                "                <Email>janne.upla@cgi.com5</Email>\n" +
                "                <Yksikko/>\n" +
                "                <Department/>\n" +
                "            </person>\n" +
                "            <person>\n" +
                "                <ObjectKey>10363986</ObjectKey>\n" +
                "                <ObjectID>5f61cf23-d553-4a47-9821-b497b8022e53</ObjectID>\n" +
                "                <AccountName>LX687859</AccountName>\n" +
                "                <DisplayName>Sillari Testi3 Testi Toinen Kuljetusyritys Oy</DisplayName>\n" +
                "                <FirstName>Testi3</FirstName>\n" +
                "                <LastName>Sillari</LastName>\n" +
                "                <Email>janne.upla@cgi.com3</Email>\n" +
                "                <Yksikko/>\n" +
                "                <Department/>\n" +
                "            </person>\n" +
                "            <person>\n" +
                "                <ObjectKey>10709140</ObjectKey>\n" +
                "                <ObjectID>79469d82-48e4-49ff-858e-480b0128b158</ObjectID>\n" +
                "                <AccountName>LX618343</AccountName>\n" +
                "                <DisplayName>Sillari Yit1 YIT Rakennus Oy</DisplayName>\n" +
                "                <FirstName>Yit1</FirstName>\n" +
                "                <LastName>Sillari</LastName>\n" +
                "                <Email>janne.upla@cgi.com</Email>\n" +
                "                <Yksikko/>\n" +
                "                <Department/>\n" +
                "            </person>\n" +
                "            <person>\n" +
                "                <ObjectKey>10709156</ObjectKey>\n" +
                "                <ObjectID>61ea1971-1b63-4c3e-b116-f4666b9b8969</ObjectID>\n" +
                "                <AccountName>LX914102</AccountName>\n" +
                "                <DisplayName>Sillari Yit2 YIT Rakennus Oy</DisplayName>\n" +
                "                <FirstName>Yit2</FirstName>\n" +
                "                <LastName>Sillari</LastName>\n" +
                "                <Email>janne.upla@cgi.com</Email>\n" +
                "                <Yksikko/>\n" +
                "                <Department/>\n" +
                "            </person>\n" +
                "            <person>\n" +
                "                <ObjectKey>10709181</ObjectKey>\n" +
                "                <ObjectID>71ef8677-4866-4f32-bc99-fc77c408e871</ObjectID>\n" +
                "                <AccountName>LX671423</AccountName>\n" +
                "                <DisplayName>Sillari Yit3 YIT Rakennus Oy</DisplayName>\n" +
                "                <FirstName>Yit3</FirstName>\n" +
                "                <LastName>Sillari</LastName>\n" +
                "                <Email>janne.upla@cgi.com</Email>\n" +
                "                <Yksikko/>\n" +
                "                <Department/>\n" +
                "            </person>\n" +
                "            <person>\n" +
                "                <ObjectKey>335342</ObjectKey>\n" +
                "                <ObjectID>041b5510-4af3-4273-a07c-10716aba4e71</ObjectID>\n" +
                "                <AccountName>K670970</AccountName>\n" +
                "                <DisplayName>Upla Janne</DisplayName>\n" +
                "                <FirstName>Janne</FirstName>\n" +
                "                <LastName>Upla</LastName>\n" +
                "                <Email>janne.upla@cgi.com</Email>\n" +
                "                <Yksikko/>\n" +
                "                <Department/>\n" +
                "            </person>\n" +
                "            <person>\n" +
                "                <ObjectKey>2999351</ObjectKey>\n" +
                "                <ObjectID>52f05daa-dbf9-4efb-a71d-785f30c3df55</ObjectID>\n" +
                "                <AccountName>L683844</AccountName>\n" +
                "                <DisplayName>Vina Miina</DisplayName>\n" +
                "                <FirstName>Miina</FirstName>\n" +
                "                <LastName>Vina</LastName>\n" +
                "                <Email>miina.vina@testi.vayla.fi</Email>\n" +
                "                <Yksikko>ICT-yksikkö</Yksikko>\n" +
                "                <Department>Tieto</Department>\n" +
                "            </person>\n" +
                "        </persons>\n" +
                "    </group>\n" +
                "</groups>";
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
