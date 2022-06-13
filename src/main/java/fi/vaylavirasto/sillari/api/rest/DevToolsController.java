package fi.vaylavirasto.sillari.api.rest;

import com.amazonaws.util.IOUtils;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import fi.vaylavirasto.sillari.api.rest.error.PDFDownloadException;
import fi.vaylavirasto.sillari.api.rest.error.TRexRestException;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import fi.vaylavirasto.sillari.service.SupervisionImageService;
import fi.vaylavirasto.sillari.service.SupervisionService;
import fi.vaylavirasto.sillari.service.fim.FIMService;
import fi.vaylavirasto.sillari.service.fim.responseModel.Groups;
import fi.vaylavirasto.sillari.service.trex.TRexBridgeInfoService;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJson;
import fi.vaylavirasto.sillari.service.trex.bridgePicInterface.TrexPicInfoResponseJson;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.apache.logging.log4j.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

@RestController
@Profile({"local", "dev"})
@RequestMapping(value = "/devtools")
public class DevToolsController {
    private static final org.apache.logging.log4j.Logger logger = LogManager.getLogger();

    @Autowired
    TRexBridgeInfoService tRexBridgeInfoService;
    @Autowired
    FIMService fimService;
    @Autowired
    SupervisionService supervisionService;
    @Autowired
    SupervisionImageService imageService;

    @RequestMapping(value = "/resttest", method = RequestMethod.GET)
    @Operation(summary = "Test basic get request")
    public String resttest() {
        return "Hello world.";
    }

    /**
     * Get the pdf supervision report from S3 (disk on dev localhost).
     * The report has been generated and status set to REPORT_SIGNED when /completesupervisions has happened in app
     *
     * @param supervisionId supervision ID
     * @return PDF file as byte[]
     * @throws PDFDownloadException when file download fails or report is not yet ready
     */
    @GetMapping(value = "/supervisionreport")
    @ResponseBody
    @Operation(summary = "Get bridge supervision report pdf by supervision ID")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", content = @Content(array = @ArraySchema(schema = @Schema(implementation = byte.class))))})
    public void getSupervisionReport(HttpServletResponse response, @RequestParam Integer supervisionId) throws PDFDownloadException {
        try {
            SupervisionModel supervision = supervisionService.getSupervision(supervisionId, true, false);
            boolean reportCreated = false;

            if (supervision != null && supervision.getCurrentStatus() != null) {
                SupervisionStatusType status = supervision.getCurrentStatus().getStatus();
                if (status == SupervisionStatusType.REPORT_SIGNED) {
                    reportCreated = true;

                    supervisionService.getSupervisionPdf(response, supervisionId);
                    if (response.getContentType() == null) {
                        throw new PDFDownloadException("Unable to download supervision report pdf file", HttpStatus.NOT_FOUND);
                    }
                }
            }

            if (!reportCreated) {
                throw new PDFDownloadException("Supervision not ready", HttpStatus.METHOD_NOT_ALLOWED);
            }

        } catch (IOException e) {
            throw new PDFDownloadException("Error downloading pdf file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Operation(summary = "Expire image")
    @DeleteMapping("/expire")
    public boolean expireImage(@RequestParam Integer id) {
        try {
            // Set image as expired in AWS bucket, delete image from DB
            imageService.expireSupervisionImage(id);
            return true;
        } catch (IOException e) {
            logger.error("Expire image failed", e);
            return false;
        }
    }

    @RequestMapping(value = "/testGetSupervisorsRawFromFim", method = RequestMethod.GET)
    @Operation(summary = "Test get SillaRi supervisor users from FIM")
    public Groups testConnectionToFim() {
        logger.debug("Test connections to fim");

        try {
            Groups groups = fimService.getSupervisorUsersXML();
            if (groups == null) {
                logger.error("FIM fail no xml");
                return null;
            } else {
                logger.debug("success getting user xml from fim");
                return groups;
            }
        } catch (Exception e) {
            logger.error("fimrest fail " + e.getClass().getName() + " " + e.getMessage());
            return null;
        }
    }

    //this can be set as "fim url" in local dev env so we get some bridge info for deving and testing when we don't connection to trex,
    @RequestMapping(value = "/localHardCodedSupervisors", method = RequestMethod.GET)
    public String fimHardString() {
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
                "                <AccountName>T012345</AccountName>\n" +
                "                <DisplayName>CGI-Local</DisplayName>\n" +
                "                <FirstName>CGI-Local</FirstName>\n" +
                "                <LastName>Testikäyttäjä</LastName>\n" +
                "                <Email>Testikäyttäjä@cgi.com</Email>\n" +
                "                <Yksikko/>\n" +
                "                <Department/>\n" +
                "            </person>\n" +
                "            <person>\n" +
                "                <ObjectKey>2999351</ObjectKey>\n" +
                "                <ObjectID>52f05daa-dbf9-4efb-a71d-785f30c3df55</ObjectID>\n" +
                "                <AccountName>USER2</AccountName>\n" +
                "                <DisplayName>Ville Varavalvoja</DisplayName>\n" +
                "                <FirstName>Ville</FirstName>\n" +
                "                <LastName>Varavalvoja</LastName>\n" +
                "                <Email>Ville.Varavalvoja@testi.vayla.fi</Email>\n" +
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
            b = tRexBridgeInfoService.getBridgeInfo("1.2.246.578.1.15.401830");
            if (b == null) {
                logger.error("trex fail  bridge null");
                return null;

            } else {
                logger.debug("success getting bridge from trex: " + b);
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
        return tRexBridgeInfoService.getBridgeInfo(oid);
    }

    //this can be set as "trex pic url" in local dev env so we get some bridge pic info for deving and testing when we don't connection to trex,
    @RequestMapping(value = "/localHardCodedPicJson/kuvatiedot", method = RequestMethod.GET)
    public TrexPicInfoResponseJson trexHardPicInfo() {
        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.registerModule(new JavaTimeModule());

        try {
            TrexPicInfoResponseJson a = objectMapper.readValue(trexHardPicInfoString(), TrexPicInfoResponseJson.class);
            return a;
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }




    //this can be set as "trex pic url" in local dev env so we get some bridge pic bin for deving and testing when we don't connection to trex,
    @RequestMapping(value = "/localHardCodedPicJson/yleiskuva", method = RequestMethod.GET)
    public void trexHardPicBin(HttpServletResponse response) throws Exception {
        getDevJpg(response);
    }


    //generate random jpg for local testing
    private void getDevJpg(HttpServletResponse response) throws Exception {

        final String FILENAME = "testPic.jpg";
        generateDevJpg(FILENAME, 100, 100, 5);

        // Get from local file system

        File inputFile = new File(FILENAME);
        if (inputFile.exists()) {
            response.setContentType("image/jpeg");
            OutputStream out = response.getOutputStream();
            FileInputStream in = new FileInputStream(inputFile);
            IOUtils.copy(in, out);
            out.close();
            in.close();
        }

    }

    private void generateDevJpg(String fileName, int width, int height, int pixSize) throws Exception {
        int x, y = 0;

        BufferedImage bufferedImage = new BufferedImage(pixSize * width, pixSize * height, BufferedImage.TYPE_3BYTE_BGR);

        Graphics2D graphics2D = (Graphics2D) bufferedImage.getGraphics();

        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                x = i * pixSize;
                y = j * pixSize;

                if ((i * j) % 6 == 0) {
                    graphics2D.setColor(Color.GRAY);
                } else if ((i + j) % 5 == 0) {
                    graphics2D.setColor(Color.BLUE);
                } else {
                    graphics2D.setColor(Color.WHITE);
                }

                graphics2D.fillRect(y, x, pixSize, pixSize);

            }

        }

        graphics2D.dispose();

        saveDevJpgToFile(bufferedImage, new File(fileName));

    }

    /**
     * Saves jpeg to file
     */

    private void saveDevJpgToFile(BufferedImage img, File file) throws IOException {

        ImageWriter writer = null;

        java.util.Iterator iter = ImageIO.getImageWritersByFormatName("jpg");

        if (iter.hasNext()) {
            writer = (ImageWriter) iter.next();
        }

        ImageOutputStream ios = ImageIO.createImageOutputStream(file);

        writer.setOutput(ios);

        ImageWriteParam param = new JPEGImageWriteParam(java.util.Locale.getDefault());

        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);

        param.setCompressionQuality(0.98f);

        writer.write(null, new IIOImage(img, null, null), param);

    }


    private String trexHardPicInfoString() {
        return "{\n" +
                "    \"kuvatiedot\": [{\n" +
                "            \"id\": 805038,\n" +
                "            \"paakuva\": {\n" +
                "                \"totuusarvo\": false\n" +
                "            },\n" +
                "            \"kuvaluokka\": {\n" +
                "                \"tunnus\": \"Y\",\n" +
                "                \"nimi\": \"Yleiskuva\"\n" +
                "            },\n" +
                "            \"kuvaluokkatarkenne\": [],\n" +
                "            \"luotu\": \"2022-05-31T05:53:03.768Z\",\n" +
                "            \"muokattu\": \"2022-05-31T05:53:17.564Z\"\n" +
                "        }, {\n" +
                "            \"id\": 805020,\n" +
                "            \"paakuva\": {\n" +
                "                \"totuusarvo\": true\n" +
                "            },\n" +
                "            \"kuvaluokka\": {\n" +
                "                \"tunnus\": \"Y\",\n" +
                "                \"nimi\": \"Yleiskuva\"\n" +
                "            },\n" +
                "            \"kuvaluokkatarkenne\": [],\n" +
                "            \"luotu\": \"2022-05-31T05:53:46.109Z\",\n" +
                "            \"muokattu\": \"2022-05-31T05:53:54.541Z\"\n" +
                "        }\n" +
                "    ]\n" +
                "}\n";

    }

    private String trexHardPicInfoStringEmpty() {
        return "{\n" +
                "    \"kuvatiedot\": [ "+
                "    ]\n" +
                "}\n";

    }


    //this can be set as "trex url" in local dev env so we get some bridge info for deving and testing when we don't connection to trex,
    @RequestMapping(value = "/localHardCodedBridgeInfoJson", method = RequestMethod.GET)
    public TrexBridgeInfoResponseJson trexHardInfo() {
        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            TrexBridgeInfoResponseJson a = objectMapper.readValue(trexHardString(), TrexBridgeInfoResponseJson.class);
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
