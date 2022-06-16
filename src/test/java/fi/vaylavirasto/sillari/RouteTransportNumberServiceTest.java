package fi.vaylavirasto.sillari;

import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.RouteTransportNumberModel;
import fi.vaylavirasto.sillari.repositories.RouteTransportNumberRepository;
import fi.vaylavirasto.sillari.service.RouteTransportNumberService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles({"test"})
public class RouteTransportNumberServiceTest {

    @Before
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Mock
    private RouteTransportNumberRepository routeTransportNumberRepository;

    @InjectMocks
    private final RouteTransportNumberService routeTransportNumberService = new RouteTransportNumberService(routeTransportNumberRepository);

    @Test
    public void testGetNextAvailableTransportNumberWithOnePermitVersion() {
        Mockito.when(routeTransportNumberRepository.getRouteTransportNumbersByRouteLeluId(Mockito.anyLong(), Mockito.anyString())).thenReturn(getSimpleTransportNumberMap());

        RouteModel route = new RouteModel();
        route.setId(1);
        route.setLeluId(123L);
        Integer result = routeTransportNumberService.getNextAvailableTransportNumber(route, "1234/2022");

        // Transport numbers 1 and 2 are used
        assertEquals(3, result.intValue());
    }

    @Test
    public void testGetNextAvailableTransportNumberWithTwoPermitVersions() {
        Mockito.when(routeTransportNumberRepository.getRouteTransportNumbersByRouteLeluId(Mockito.anyLong(), Mockito.anyString())).thenReturn(getTransportNumberMapFor2PermitVersions());

        RouteModel route = new RouteModel();
        route.setId(2);
        route.setLeluId(123L);
        Integer result = routeTransportNumberService.getNextAvailableTransportNumber(route, "1234/2022");

        // Transport numbers 1 and 2 are used in permit version 1 -> 3 and 4 available for permit version 2
        assertEquals(3, result.intValue());
    }

    @Test
    public void testGetNextAvailableTransportNumberWithThreePermitVersions() {
        Mockito.when(routeTransportNumberRepository.getRouteTransportNumbersByRouteLeluId(Mockito.anyLong(), Mockito.anyString())).thenReturn(getTransportNumberMapFor3PermitVersions());

        RouteModel route = new RouteModel();
        route.setId(3);
        route.setLeluId(123L);
        Integer result = routeTransportNumberService.getNextAvailableTransportNumber(route, "1234/2022");

        // Transport numbers 1-3 are used in permit version 2, 4 is used in permit version 3 -> only 5 available
        assertEquals(5, result.intValue());
    }

    // This should never happen, because old permit versions are disabled in ui when a new version is sent from LeLu.
    @Test
    public void testGetNextAvailableTransportNumberWithOldPermitVersion() {
        Mockito.when(routeTransportNumberRepository.getRouteTransportNumbersByRouteLeluId(Mockito.anyLong(), Mockito.anyString())).thenReturn(getTransportNumberMapFor3PermitVersions());

        RouteModel route = new RouteModel();
        route.setId(2);
        route.setLeluId(123L);
        Integer result = routeTransportNumberService.getNextAvailableTransportNumber(route, "1234/2022");

        // Transport numbers 1-3 are used in permit version 2, 4 is used in permit version 3 -> only 5 available
        assertEquals(5, result.intValue());
    }

    @Test
    public void testGetNextAvailableTransportNumberWithSomeTransportDeleted() {
        Mockito.when(routeTransportNumberRepository.getRouteTransportNumbersByRouteLeluId(Mockito.anyLong(), Mockito.anyString())).thenReturn(getTransportNumberMapSomeDeleted());

        RouteModel route = new RouteModel();
        route.setId(2);
        route.setLeluId(123L);
        Integer result = routeTransportNumberService.getNextAvailableTransportNumber(route, "1234/2022");

        // Transport numbers 1 and 3 are used -> 2 and 4 available for permit version 2
        assertEquals(2, result.intValue());
    }

    @Test
    public void testGetNextAvailableTransportNumberNoneAvailable() {
        Mockito.when(routeTransportNumberRepository.getRouteTransportNumbersByRouteLeluId(Mockito.anyLong(), Mockito.anyString())).thenReturn(getSimpleTransportNumberMapNoneAvailable());

        RouteModel route = new RouteModel();
        route.setId(1);
        route.setLeluId(123L);
        Integer result = routeTransportNumberService.getNextAvailableTransportNumber(route, "1234/2022");

        // All three transport numbers are used
        assertNull(result);
    }

    @Test
    public void testGetNextAvailableTransportNumberNoneAvailableForCurrentPermitVersion() {
        Mockito.when(routeTransportNumberRepository.getRouteTransportNumbersByRouteLeluId(Mockito.anyLong(), Mockito.anyString())).thenReturn(getTransportNumberMapFor2PermitVersionsNoneAvailable());

        RouteModel route = new RouteModel();
        route.setId(2);
        route.setLeluId(123L);
        Integer result = routeTransportNumberService.getNextAvailableTransportNumber(route, "1234/2022");

        // Route 1 has transport number 3 available, but route 2 has used both 1 and 2, and total transport count is 2 for this version
        assertNull(result);
    }

    private Map<Integer, List<RouteTransportNumberModel>> getSimpleTransportNumberMap() {
        List<RouteTransportNumberModel> routeTransportNumbers = new ArrayList<>();

        RouteTransportNumberModel model1 = createRouteTransportNumberModel(1, 1, 3, 1, 1, true, 1, true);
        RouteTransportNumberModel model2 = createRouteTransportNumberModel(2, 1, 3, 1, 1, true, 2, true);
        // This is the next available transport number for route 1
        RouteTransportNumberModel model3 = createRouteTransportNumberModel(3, 1, 3, 1, 1, true, 3, false);

        routeTransportNumbers.add(model1);
        routeTransportNumbers.add(model2);
        routeTransportNumbers.add(model3);

        Map<Integer, List<RouteTransportNumberModel>> map = new HashMap<>();
        map.put(1, routeTransportNumbers);
        return map;
    }

    private Map<Integer, List<RouteTransportNumberModel>> getTransportNumberMapFor2PermitVersions() {
        List<RouteTransportNumberModel> routeTransportNumbers1 = new ArrayList<>();

        RouteTransportNumberModel model1 = createRouteTransportNumberModel(1, 1, 3, 1, 1, false, 1, true);
        RouteTransportNumberModel model2 = createRouteTransportNumberModel(2, 1, 3, 1, 1, false, 2, true);
        RouteTransportNumberModel model3 = createRouteTransportNumberModel(3, 1, 3, 1, 1, false, 3, false);

        routeTransportNumbers1.add(model1);
        routeTransportNumbers1.add(model2);
        routeTransportNumbers1.add(model3);

        List<RouteTransportNumberModel> routeTransportNumbers2 = new ArrayList<>();

        RouteTransportNumberModel model4 = createRouteTransportNumberModel(4, 2, 4, 2, 2, true, 1, false);
        RouteTransportNumberModel model5 = createRouteTransportNumberModel(5, 2, 4, 2, 2, true, 2, false);
        // This is the next available transport number for route 2
        RouteTransportNumberModel model6 = createRouteTransportNumberModel(6, 2, 4, 2, 2, true, 3, false);
        RouteTransportNumberModel model7 = createRouteTransportNumberModel(7, 2, 4, 2, 2, true, 4, false);

        routeTransportNumbers2.add(model4);
        routeTransportNumbers2.add(model5);
        routeTransportNumbers2.add(model6);
        routeTransportNumbers2.add(model7);

        Map<Integer, List<RouteTransportNumberModel>> map = new HashMap<>();
        map.put(1, routeTransportNumbers1);
        map.put(2, routeTransportNumbers2);
        return map;
    }

    private Map<Integer, List<RouteTransportNumberModel>> getTransportNumberMapFor3PermitVersions() {
        List<RouteTransportNumberModel> routeTransportNumbers1 = new ArrayList<>();

        RouteTransportNumberModel model1 = createRouteTransportNumberModel(1, 1, 2, 1, 1, false, 1, false);
        RouteTransportNumberModel model2 = createRouteTransportNumberModel(2, 1, 2, 1, 1, false, 2, false);

        routeTransportNumbers1.add(model1);
        routeTransportNumbers1.add(model2);

        List<RouteTransportNumberModel> routeTransportNumbers2 = new ArrayList<>();

        RouteTransportNumberModel model3 = createRouteTransportNumberModel(3, 2, 5, 2, 2, false, 1, true);
        RouteTransportNumberModel model4 = createRouteTransportNumberModel(4, 2, 5, 2, 2, false, 2, true);
        RouteTransportNumberModel model5 = createRouteTransportNumberModel(5, 2, 5, 2, 2, false, 3, true);
        RouteTransportNumberModel model6 = createRouteTransportNumberModel(6, 2, 5, 2, 2, false, 4, false);
        // This is the next available transport number for route 2
        RouteTransportNumberModel model7 = createRouteTransportNumberModel(7, 2, 5, 2, 2, false, 5, false);

        routeTransportNumbers2.add(model3);
        routeTransportNumbers2.add(model4);
        routeTransportNumbers2.add(model5);
        routeTransportNumbers2.add(model6);
        routeTransportNumbers2.add(model7);

        List<RouteTransportNumberModel> routeTransportNumbers3 = new ArrayList<>();

        RouteTransportNumberModel model8 = createRouteTransportNumberModel(8, 3, 5, 3, 3, true, 1, false);
        RouteTransportNumberModel model9 = createRouteTransportNumberModel(9, 3, 5, 3, 3, true, 2, false);
        RouteTransportNumberModel model10 = createRouteTransportNumberModel(10, 3, 5, 3, 3, true, 3, false);
        RouteTransportNumberModel model11 = createRouteTransportNumberModel(11, 3, 5, 3, 3, true, 4, true);
        // This is the next available transport number for route 3
        RouteTransportNumberModel model12 = createRouteTransportNumberModel(12, 3, 5, 3, 3, true, 5, false);


        routeTransportNumbers3.add(model8);
        routeTransportNumbers3.add(model9);
        routeTransportNumbers3.add(model10);
        routeTransportNumbers3.add(model11);
        routeTransportNumbers3.add(model12);

        Map<Integer, List<RouteTransportNumberModel>> map = new HashMap<>();
        map.put(1, routeTransportNumbers1);
        map.put(2, routeTransportNumbers2);
        map.put(3, routeTransportNumbers3);
        return map;
    }

    private Map<Integer, List<RouteTransportNumberModel>> getTransportNumberMapSomeDeleted() {
        List<RouteTransportNumberModel> routeTransportNumbers1 = new ArrayList<>();

        RouteTransportNumberModel model1 = createRouteTransportNumberModel(1, 1, 3, 1, 1, false, 1, true);
        RouteTransportNumberModel model2 = createRouteTransportNumberModel(2, 1, 3, 1, 1, false, 2, false);
        RouteTransportNumberModel model3 = createRouteTransportNumberModel(3, 1, 3, 1, 1, false, 3, false);

        routeTransportNumbers1.add(model1);
        routeTransportNumbers1.add(model2);
        routeTransportNumbers1.add(model3);

        List<RouteTransportNumberModel> routeTransportNumbers2 = new ArrayList<>();

        RouteTransportNumberModel model4 = createRouteTransportNumberModel(4, 2, 4, 2, 2, true, 1, false);
        // This is the next available transport number for route 2
        RouteTransportNumberModel model5 = createRouteTransportNumberModel(5, 2, 4, 2, 2, true, 2, false);
        RouteTransportNumberModel model6 = createRouteTransportNumberModel(6, 2, 4, 2, 2, true, 3, true);
        RouteTransportNumberModel model7 = createRouteTransportNumberModel(7, 2, 4, 2, 2, true, 4, false);

        routeTransportNumbers2.add(model4);
        routeTransportNumbers2.add(model5);
        routeTransportNumbers2.add(model6);
        routeTransportNumbers2.add(model7);

        Map<Integer, List<RouteTransportNumberModel>> map = new HashMap<>();
        map.put(1, routeTransportNumbers1);
        map.put(2, routeTransportNumbers2);
        return map;
    }

    private Map<Integer, List<RouteTransportNumberModel>> getSimpleTransportNumberMapNoneAvailable() {
        List<RouteTransportNumberModel> routeTransportNumbers = new ArrayList<>();

        RouteTransportNumberModel model1 = createRouteTransportNumberModel(1, 1, 3, 1, 1, true, 1, true);
        RouteTransportNumberModel model2 = createRouteTransportNumberModel(2, 1, 3, 1, 1, true, 2, true);
        RouteTransportNumberModel model3 = createRouteTransportNumberModel(3, 1, 3, 1, 1, true, 3, true);

        routeTransportNumbers.add(model1);
        routeTransportNumbers.add(model2);
        routeTransportNumbers.add(model3);

        Map<Integer, List<RouteTransportNumberModel>> map = new HashMap<>();
        map.put(1, routeTransportNumbers);
        return map;
    }

    private Map<Integer, List<RouteTransportNumberModel>> getTransportNumberMapFor2PermitVersionsNoneAvailable() {
        List<RouteTransportNumberModel> routeTransportNumbers1 = new ArrayList<>();

        RouteTransportNumberModel model1 = createRouteTransportNumberModel(1, 1, 3, 1, 1, false, 1, true);
        RouteTransportNumberModel model2 = createRouteTransportNumberModel(2, 1, 3, 1, 1, false, 2, false);
        RouteTransportNumberModel model3 = createRouteTransportNumberModel(3, 1, 3, 1, 1, false, 3, false);

        routeTransportNumbers1.add(model1);
        routeTransportNumbers1.add(model2);
        routeTransportNumbers1.add(model3);

        List<RouteTransportNumberModel> routeTransportNumbers2 = new ArrayList<>();

        RouteTransportNumberModel model4 = createRouteTransportNumberModel(4, 2, 2, 2, 2, true, 1, false);
        RouteTransportNumberModel model5 = createRouteTransportNumberModel(5, 2, 2, 2, 2, true, 2, true);

        routeTransportNumbers2.add(model4);
        routeTransportNumbers2.add(model5);

        Map<Integer, List<RouteTransportNumberModel>> map = new HashMap<>();
        map.put(1, routeTransportNumbers1);
        map.put(2, routeTransportNumbers2);
        return map;
    }

    private RouteTransportNumberModel createRouteTransportNumberModel(Integer id, Integer routeId, Integer totalTransportCount,
                                                                      Integer permitId, Integer permitVersion, boolean isCurrentVersion,
                                                                      Integer transportNumber, boolean used) {
        RouteTransportNumberModel model = new RouteTransportNumberModel();
        model.setId(id);
        model.setRouteId(routeId);
        model.setRouteLeluId(123L);
        model.setRouteTotalTransportCount(totalTransportCount);
        model.setPermitId(permitId);
        model.setPermitNumber("1234/2022");
        model.setPermitLeluVersion(permitVersion);
        model.setPermitIsCurrentVersion(isCurrentVersion);
        model.setTransportNumber(transportNumber);
        model.setUsed(used);
        return model;
    }

}
