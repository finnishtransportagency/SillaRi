package fi.vaylavirasto.sillari;

import fi.vaylavirasto.sillari.api.rest.error.LeluDeleteRouteWithSupervisionsException;
import fi.vaylavirasto.sillari.api.lelu.permit.*;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import fi.vaylavirasto.sillari.service.LeluRouteUploadUtil;
import fi.vaylavirasto.sillari.service.LeluService;
import fi.vaylavirasto.sillari.service.trex.TRexService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.MessageSource;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles({"test"})
public class LeluServiceTest {
    private static final Logger logger = LogManager.getLogger();

    @Before
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Mock
    private PermitRepository permitRepository;
    @Mock
    private CompanyRepository companyRepository;
    @Mock
    private RouteRepository routeRepository;
    @Mock
    private RouteBridgeRepository routeBridgeRepository;
    @Mock
    private BridgeRepository bridgeRepository;
    @Mock
    private SupervisionRepository supervisionRepository;
    @Mock
    private AWSS3Client awss3Client;
    @Mock
    private TRexService trexService;


    @Autowired
    private MessageSource messageSource;

    @Autowired
    private LeluRouteUploadUtil leluRouteUploadUtil;




    @Captor
    ArgumentCaptor<PermitModel> permitModelCaptor;
    @Captor
    ArgumentCaptor<List<Integer>> routeIdsToDeleteCaptor;


    @InjectMocks
    private final LeluService leluService = new LeluService(permitRepository, companyRepository, routeRepository, routeBridgeRepository,  bridgeRepository, supervisionRepository, messageSource, leluRouteUploadUtil, awss3Client, trexService);

    @Test
    public void testCreatePermitWithExistingCompany() {
        Mockito.when(companyRepository.getCompanyIdByBusinessId(Mockito.anyString())).thenReturn(1);
        Mockito.when(permitRepository.getPermitIdByPermitNumberAndVersion(Mockito.anyString(), Mockito.anyInt())).thenReturn(null);
        Mockito.when(permitRepository.createPermit(Mockito.any(PermitModel.class))).thenReturn(1);
        Mockito.when(bridgeRepository.getBridgeIdsWithOIDs(Mockito.anyList())).thenReturn(getBridgeOIDAndIdMap());

        LeluPermitResponseDTO response = null;
        try {
            response = leluService.createOrUpdatePermit(getPermitDTO());
        } catch (LeluDeleteRouteWithSupervisionsException e) {
            e.printStackTrace();
        }

        // Verify that permitRepository.createPermit is called and capture parameters
        Mockito.verify(permitRepository).createPermit(permitModelCaptor.capture());
        PermitModel permitModel = permitModelCaptor.getValue();
        logger.debug("Captured permitModel: {}", permitModel);

        // Check that all values are correctly mapped from Lelu DTOs to models
        assertPermitDTOMappedToModel(permitModel);

        // Assert company ID is added to permit
        assertEquals(1, permitModel.getCompanyId().intValue());

        // Assert correct bridge IDs are added to route bridges
        assertBridgeIdsAdded(permitModel);

        // Assert the resulting response
        assertNotNull(response);
        assertEquals(1, response.getPermitId().intValue());
        assertEquals("1234/2021", response.getPermitNumber());
        assertEquals(LeluPermitStatus.CREATED, response.getStatus());
        assertNotNull(response.getTimestamp());
    }

    @Test
    public void testCreatePermitWithNewCompany() {
        System.out.println("TESTIOUS");
        Mockito.when(companyRepository.getCompanyIdByBusinessId(Mockito.anyString())).thenReturn(null);
        Mockito.when(companyRepository.createCompany(Mockito.any(CompanyModel.class))).thenReturn(2);

        Mockito.when(permitRepository.getPermitIdByPermitNumberAndVersion(Mockito.anyString(), Mockito.anyInt())).thenReturn(null);
        Mockito.when(permitRepository.createPermit(Mockito.any(PermitModel.class))).thenReturn(2);
        Mockito.when(permitRepository.hasSupervisions(Mockito.any(List.class))).thenReturn(false);
        Mockito.when(bridgeRepository.getBridgeIdsWithOIDs(Mockito.anyList())).thenReturn(getBridgeOIDAndIdMap());

        LeluPermitResponseDTO response = null;
        try {
            System.out.println("TESTIOUS");
            response = leluService.createOrUpdatePermit(getPermitDTO());
            System.out.println("TESTIOUS");
        } catch (LeluDeleteRouteWithSupervisionsException e) {
            System.out.println("TESTIOUS");
            e.printStackTrace();
        }

        // Verify that permitRepository.createPermit is called and capture parameters
        Mockito.verify(permitRepository).createPermit(permitModelCaptor.capture());
        PermitModel permitModel = permitModelCaptor.getValue();
        logger.debug("Captured permitModel: {}", permitModel);

        // Check that all values are correctly mapped from Lelu DTOs to models
        assertPermitDTOMappedToModel(permitModel);

        // Assert company ID is added to permit
        assertEquals(2, permitModel.getCompanyId().intValue());

        // Assert correct bridge IDs are added to route bridges
        assertBridgeIdsAdded(permitModel);

        // Assert the resulting response
        assertNotNull(response);
        assertEquals(2, response.getPermitId().intValue());
        assertEquals("1234/2021", response.getPermitNumber());
        assertEquals(LeluPermitStatus.CREATED, response.getStatus());
        assertNotNull(response.getTimestamp());
    }

    @Test
    public void testUpdatePermit() {
        Mockito.when(companyRepository.getCompanyIdByBusinessId(Mockito.anyString())).thenReturn(1);
        Mockito.when(permitRepository.getPermitIdByPermitNumberAndVersion(Mockito.anyString(), Mockito.anyInt())).thenReturn(2);
        Mockito.when(routeRepository.getRouteIdsWithLeluIds(Mockito.anyInt())).thenReturn(getRouteLeluIdAndIdMap());
        Mockito.when(bridgeRepository.getBridgeIdsWithOIDs(Mockito.anyList())).thenReturn(getBridgeOIDAndIdMap());

        LeluPermitResponseDTO response = null;
        try {
            response = leluService.createOrUpdatePermit(getPermitDTO());
        } catch (LeluDeleteRouteWithSupervisionsException e) {
            e.printStackTrace();
        }

        // Verify that permitRepository.updatePermit is called and capture parameters
        Mockito.verify(permitRepository).updatePermit(permitModelCaptor.capture(), routeIdsToDeleteCaptor.capture());
        PermitModel permitModel = permitModelCaptor.getValue();
        logger.debug("Captured permitModel: {}", permitModel);
        List<Integer> routeIdsToDelete = routeIdsToDeleteCaptor.getValue();
        logger.debug("Captured routeIdsToDelete: {}", routeIdsToDelete);

        // Check that all values are correctly mapped from Lelu DTOs to models
        assertPermitDTOMappedToModel(permitModel);

        // Route with Lelu ID 43567 is found from DB but not found in permitModel, check it's marked for deletion
        assertNotNull(routeIdsToDelete);
        assertEquals(1, routeIdsToDelete.size());
        assertEquals(4, routeIdsToDelete.get(0).intValue());

        // Assert existing route IDs are added, third one is new and has no ID
        assertEquals(1, permitModel.getRoutes().get(0).getId().intValue());
        assertEquals(2, permitModel.getRoutes().get(1).getId().intValue());
        assertNull(permitModel.getRoutes().get(2).getId());

        // Assert company ID is added to permit
        assertEquals(1, permitModel.getCompanyId().intValue());

        // Assert correct bridge IDs are added to route bridges
        assertBridgeIdsAdded(permitModel);

        // Assert the resulting response
        assertNotNull(response);
        assertEquals(2, response.getPermitId().intValue());
        assertEquals("1234/2021", response.getPermitNumber());
        assertEquals(LeluPermitStatus.UPDATED, response.getStatus());
        assertNotNull(response.getTimestamp());
    }

    private LeluPermitDTO getPermitDTO() {
        LeluPermitDTO permit = new LeluPermitDTO();
        permit.setNumber("1234/2021");
        permit.setLastModifiedDate(LocalDateTime.of(2021, 10, 1, 8, 10));
        permit.setVersion(1);
        permit.setValidFrom(LocalDateTime.of(2021, 10, 1, 0, 0));
        permit.setValidTo(LocalDateTime.of(2021, 12, 31, 23, 59));

        permit.setCustomer(new LeluCustomerDTO("Yritys Y", "1234567-8"));

        List<LeluVehicleDTO> vehicles = new ArrayList<>();
        LeluVehicleDTO vehicle1 = new LeluVehicleDTO("kuorma-auto", "ABC-123");
        LeluVehicleDTO vehicle2 = new LeluVehicleDTO("puoliperävaunu", "BCD-234");
        vehicles.add(vehicle1);
        vehicles.add(vehicle2);
        permit.setVehicles(vehicles);

        List<LeluAxleDTO> axles = new ArrayList<>();
        LeluAxleDTO axle1 = new LeluAxleDTO(1, 9.1, 2.4, null);
        LeluAxleDTO axle2 = new LeluAxleDTO(2, 8.1, 1.4, null);
        LeluAxleDTO axle3 = new LeluAxleDTO(3, 19.1, 3.4, null);
        LeluAxleDTO axle4 = new LeluAxleDTO(4, 9.1, 1.4, null);
        LeluAxleDTO axle5 = new LeluAxleDTO(5, 17.1, 1.4, null);
        LeluAxleDTO axle6 = new LeluAxleDTO(6, 5.1, 1.4, null);
        LeluAxleDTO axle7 = new LeluAxleDTO(7, 5.3, 1.4, null);
        LeluAxleDTO axle8 = new LeluAxleDTO(8, 9.1, 7.4, 12.4);
        LeluAxleDTO axle9 = new LeluAxleDTO(9, 9.1, 2.4, null);
        LeluAxleDTO axle10 = new LeluAxleDTO(10, 15.1, 2.4, null);
        LeluAxleDTO axle11 = new LeluAxleDTO(11, 15.1, 2.4, null);
        LeluAxleDTO axle12 = new LeluAxleDTO(12, 15.1, 2.4, null);
        LeluAxleDTO axle13 = new LeluAxleDTO(13, 9.1, 2.4, null);
        LeluAxleDTO axle14 = new LeluAxleDTO(14, 2.1, (double) 0, null);

        axles.add(axle1);
        axles.add(axle2);
        axles.add(axle3);
        axles.add(axle4);
        axles.add(axle5);
        axles.add(axle6);
        axles.add(axle7);
        axles.add(axle8);
        axles.add(axle9);
        axles.add(axle10);
        axles.add(axle11);
        axles.add(axle12);
        axles.add(axle13);
        axles.add(axle14);

        LeluAxleChartDTO axleChart = new LeluAxleChartDTO(axles);
        permit.setAxleChart(axleChart);

        permit.setTransportTotalMass(147.6);
        permit.setTransportDimensions(new LeluTransportDimensionsDTO(3.45, 33.3, 4.5));
        permit.setAdditionalDetails("Test!");

        List<LeluRouteDTO> routes = new ArrayList<>();

        LeluBridgeDTO bridge1 = new LeluBridgeDTO("1.1.111.111.1.11.111111", "B-01", "Bridge1", "00001 001 0 01111", "AA", "info1");
        LeluBridgeDTO bridge2 = new LeluBridgeDTO("2.2.222.222.2.22.222222", "B-02", "Bridge2", "00002 002 0 02222", "BB", "info2");
        LeluBridgeDTO bridge3 = new LeluBridgeDTO("3.3.333.333.3.33.333333", "B-03", "Bridge3", "00003 003 0 03333", "CC", "info3");
        LeluBridgeDTO bridge4 = new LeluBridgeDTO("4.4.444.444.4.44.444444", "B-04", "Bridge4", "00004 004 0 04444", "DD", "info4");
        LeluBridgeDTO bridge5 = new LeluBridgeDTO("5.5.555.555.5.55.555555", "B-05", "Bridge5", "00005 005 0 05555", "EE", "info5");
        LeluBridgeDTO bridge6 = new LeluBridgeDTO("6.6.666.666.6.66.666666", "B-06", "Bridge6", "00006 006 0 06666", "FF", "info6");
        LeluBridgeDTO bridge7 = new LeluBridgeDTO("7.7.777.777.7.77.777777", "B-07", "Bridge7", "00007 007 0 07777", "GG", "info7");

        List<LeluBridgeDTO> bridges1to3 = new ArrayList<>();
        bridges1to3.add(bridge1);
        bridges1to3.add(bridge2);
        bridges1to3.add(bridge3);

        List<LeluBridgeDTO> bridges4to5 = new ArrayList<>();
        bridges4to5.add(bridge4);
        bridges4to5.add(bridge5);

        List<LeluBridgeDTO> bridges6to7 = new ArrayList<>();
        bridges6to7.add(bridge6);
        bridges6to7.add(bridge7);

        LeluRouteDTO route1 = new LeluRouteDTO((long) 12345, "Bridges 1 to 3", 3, false, bridges1to3);
        LeluRouteDTO route2 = new LeluRouteDTO((long) 23456, "Bridges 4 to 5", 5, false, bridges4to5);
        LeluRouteDTO route3 = new LeluRouteDTO((long) 34567, "Bridges 6 to 7", 7, false, bridges6to7);

        routes.add(route1);
        routes.add(route2);
        routes.add(route3);

        permit.setRoutes(routes);

        return permit;
    }

    private Map<String, Integer> getBridgeOIDAndIdMap() {
        Map<String, Integer> map = new HashMap<>();
        map.put("1.1.111.111.1.11.111111", 1);
        map.put("2.2.222.222.2.22.222222", 2);
        map.put("3.3.333.333.3.33.333333", 3);
        map.put("4.4.444.444.4.44.444444", 4);
        map.put("5.5.555.555.5.55.555555", 5);
        map.put("6.6.666.666.6.66.666666", 6);
        map.put("7.7.777.777.7.77.777777", 7);
        return map;
    }

    private Map<Long, Integer> getRouteLeluIdAndIdMap() {
        Map<Long, Integer> map = new HashMap<>();
        map.put((long) 12345, 1);
        map.put((long) 23456, 2);
        map.put((long) 43567, 4);
        return map;
    }

    private void assertPermitDTOMappedToModel(PermitModel permitModel) {
        assertNotNull(permitModel);
        assertEquals("1234/2021", permitModel.getPermitNumber());
        assertEquals(1, permitModel.getLeluVersion().intValue());

        LocalDateTime expectedTime1 = LocalDateTime.of(2021, 10, 1, 8, 10);
        LocalDateTime expectedTime2 = LocalDateTime.of(2021, 10, 1, 0, 0);
        LocalDateTime expectedTime3 = LocalDateTime.of(2021, 12, 31, 23, 59);

        assertEquals(OffsetDateTime.of(expectedTime1, getZoneOffset(expectedTime1)), permitModel.getLeluLastModifiedDate());
        assertEquals(OffsetDateTime.of(expectedTime2, getZoneOffset(expectedTime2)), permitModel.getValidStartDate());
        assertEquals(OffsetDateTime.of(expectedTime3, getZoneOffset(expectedTime3)), permitModel.getValidEndDate());

        assertEquals("Yritys Y", permitModel.getCompany().getName());
        assertEquals("1234567-8", permitModel.getCompany().getBusinessId());

        assertEquals(2, permitModel.getVehicles().size());
        assertEquals("kuorma-auto", permitModel.getVehicles().get(0).getType());
        assertEquals("ABC-123", permitModel.getVehicles().get(0).getIdentifier());
        assertEquals("puoliperävaunu", permitModel.getVehicles().get(1).getType());
        assertEquals("BCD-234", permitModel.getVehicles().get(1).getIdentifier());

        assertNotNull(permitModel.getAxleChart());
        assertEquals(14, permitModel.getAxleChart().getAxles().size());
        assertAxle(permitModel.getAxleChart().getAxles().get(0), 1, 9.1, 2.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(1), 2, 8.1, 1.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(2), 3, 19.1, 3.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(3), 4, 9.1, 1.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(4), 5, 17.1, 1.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(5), 6, 5.1, 1.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(6), 7, 5.3, 1.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(7), 8, 9.1, 7.4, 12.4);
        assertAxle(permitModel.getAxleChart().getAxles().get(8), 9, 9.1, 2.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(9), 10, 15.1, 2.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(10), 11, 15.1, 2.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(11), 12, 15.1, 2.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(12), 13, 9.1, 2.4, null);
        assertAxle(permitModel.getAxleChart().getAxles().get(13), 14, 2.1, (double) 0, null);

        assertEquals(BigDecimal.valueOf(147.6), permitModel.getTransportTotalMass());
        assertNotNull(permitModel.getTransportDimensions());
        assertEquals(BigDecimal.valueOf(3.45), permitModel.getTransportDimensions().getWidth());
        assertEquals(BigDecimal.valueOf(33.3), permitModel.getTransportDimensions().getLength());
        assertEquals(BigDecimal.valueOf(4.5), permitModel.getTransportDimensions().getHeight());

        assertEquals("Test!", permitModel.getAdditionalDetails());

        assertEquals(3, permitModel.getRoutes().size());

        RouteModel route1 = permitModel.getRoutes().get(0);
        assertEquals(12345, route1.getLeluId().longValue());
        assertEquals("Bridges 1 to 3", route1.getName());
        assertEquals(3, route1.getTransportCount().intValue());
        assertFalse(route1.getAlternativeRoute());
        assertEquals(3, route1.getRouteBridges().size());

        RouteBridgeModel routeBridge1 = route1.getRouteBridges().get(0);
        assertEquals("info1", routeBridge1.getCrossingInstruction());
        assertBridge(routeBridge1.getBridge(), "1.1.111.111.1.11.111111", "B-01", "Bridge1", "00001 001 0 01111");

        RouteBridgeModel routeBridge2 = route1.getRouteBridges().get(1);
        assertEquals("info2", routeBridge2.getCrossingInstruction());
        assertBridge(routeBridge2.getBridge(), "2.2.222.222.2.22.222222", "B-02", "Bridge2", "00002 002 0 02222");

        RouteBridgeModel routeBridge3 = route1.getRouteBridges().get(2);
        assertEquals("info3", routeBridge3.getCrossingInstruction());
        assertBridge(routeBridge3.getBridge(), "3.3.333.333.3.33.333333", "B-03", "Bridge3", "00003 003 0 03333");

        RouteModel route2 = permitModel.getRoutes().get(1);
        assertEquals(23456, route2.getLeluId().longValue());
        assertEquals("Bridges 4 to 5", route2.getName());

        assertEquals(5, route2.getTransportCount().intValue());
        assertFalse(route2.getAlternativeRoute());
        assertEquals(2, route2.getRouteBridges().size());

        RouteBridgeModel routeBridge4 = route2.getRouteBridges().get(0);
        assertEquals("info4", routeBridge4.getCrossingInstruction());
        assertBridge(routeBridge4.getBridge(), "4.4.444.444.4.44.444444", "B-04", "Bridge4", "00004 004 0 04444");

        RouteBridgeModel routeBridge5 = route2.getRouteBridges().get(1);
        assertEquals("info5", routeBridge5.getCrossingInstruction());
        assertBridge(routeBridge5.getBridge(), "5.5.555.555.5.55.555555", "B-05", "Bridge5", "00005 005 0 05555");

        RouteModel route3 = permitModel.getRoutes().get(2);
        assertEquals(34567, route3.getLeluId().longValue());
        assertEquals("Bridges 6 to 7", route3.getName());
        assertEquals(7, route3.getTransportCount().intValue());
        assertFalse(route3.getAlternativeRoute());
        assertEquals(2, route3.getRouteBridges().size());

        RouteBridgeModel routeBridge6 = route3.getRouteBridges().get(0);
        assertEquals("info6", routeBridge6.getCrossingInstruction());
        assertBridge(routeBridge6.getBridge(), "6.6.666.666.6.66.666666", "B-06", "Bridge6", "00006 006 0 06666");

        RouteBridgeModel routeBridge7 = route3.getRouteBridges().get(1);
        assertEquals("info7", routeBridge7.getCrossingInstruction());
        assertBridge(routeBridge7.getBridge(), "7.7.777.777.7.77.777777", "B-07", "Bridge7", "00007 007 0 07777");

    }

    private void assertAxle(AxleModel axle, Integer axleNumber, Double weight, Double distanceToNext, Double maxDistanceToNext) {
        assertEquals(axleNumber, axle.getAxleNumber());
        assertEquals(BigDecimal.valueOf(weight), axle.getWeight());
        assertEquals(BigDecimal.valueOf(distanceToNext), axle.getDistanceToNext());
        if (maxDistanceToNext != null) {
            assertEquals(BigDecimal.valueOf(maxDistanceToNext), axle.getMaxDistanceToNext());
        }
    }

    private void assertBridge(BridgeModel bridge, String oid, String identifier, String name, String roadAddress) {
        assertNotNull(bridge);
        assertEquals(oid, bridge.getOid());
        assertEquals(identifier, bridge.getIdentifier());
        assertEquals(name, bridge.getName());
        assertEquals(roadAddress, bridge.getRoadAddress());
    }

    private void assertBridgeIdsAdded(PermitModel permitModel) {
        assertEquals(1, permitModel.getRoutes().get(0).getRouteBridges().get(0).getBridgeId().intValue());
        assertEquals(2, permitModel.getRoutes().get(0).getRouteBridges().get(1).getBridgeId().intValue());
        assertEquals(3, permitModel.getRoutes().get(0).getRouteBridges().get(2).getBridgeId().intValue());
        assertEquals(4, permitModel.getRoutes().get(1).getRouteBridges().get(0).getBridgeId().intValue());
        assertEquals(5, permitModel.getRoutes().get(1).getRouteBridges().get(1).getBridgeId().intValue());
        assertEquals(6, permitModel.getRoutes().get(2).getRouteBridges().get(0).getBridgeId().intValue());
        assertEquals(7, permitModel.getRoutes().get(2).getRouteBridges().get(1).getBridgeId().intValue());
    }

    private ZoneOffset getZoneOffset(LocalDateTime localDateTime) {
        return ZoneOffset.systemDefault().getRules().getOffset(localDateTime);
    }

}
