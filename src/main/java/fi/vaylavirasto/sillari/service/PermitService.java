package fi.vaylavirasto.sillari.service;

import com.amazonaws.util.IOUtils;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.repositories.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.*;

@Service
public class PermitService {
    @Autowired
    PermitRepository permitRepository;
    @Autowired
    AxleRepository axleRepository;
    @Autowired
    VehicleRepository vehicleRepository;
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    RouteBridgeRepository routeBridgeRepository;
    @Autowired
    RouteTransportRepository routeTransportRepository;
    @Autowired
    AWSS3Client awss3Client;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    private static final Logger logger = LogManager.getLogger();

    public PermitModel getPermit(Integer permitId) {
        PermitModel permitModel = permitRepository.getPermit(permitId);
        fillPermitDetails(permitModel, null);
        return permitModel;
    }


    public PermitModel getPermitWithOnlyNextAvailableTransportInstance(Integer permitId) {
        PermitModel permitModel = permitRepository.getPermit(permitId);
        logger.debug("hellohau:" + permitId);
        Map<Integer, Integer> maxUsedTransportNumbers = createMaxUsedTransportNumbersMap(permitId);

        logger.debug("hellohau:" + routeTransportRepository.getRouteTransportsByPermitId(permitId));
        logger.debug("hellohau:" + maxUsedTransportNumbers);
        fillPermitDetails(permitModel, maxUsedTransportNumbers);
        return permitModel;
    }

    //Returns map from routeId to max routeTransport.tranportNumber of that route, 0 if no routeTransports.
    private Map<Integer, Integer> createMaxUsedTransportNumbersMap(Integer permitId) {
        List<RouteTransportModel> routeTransportModels = routeTransportRepository.getRouteTransportsByPermitId(permitId);
        Map<Integer, Integer> returnMap = new HashMap();
        for (RouteTransportModel routeTransportModel : routeTransportModels) {
            if (returnMap.get(routeTransportModel.getRouteId()) == null){
                returnMap.put(routeTransportModel.getRouteId(), 0);
            }
            else if (routeTransportModel.getTransportNumber() > returnMap.get(routeTransportModel.getRouteId())) {
                returnMap.put(routeTransportModel.getRouteId(), routeTransportModel.getTransportNumber());
            }
        }
        return returnMap;
    }

    public PermitModel getPermitOfRouteTransport(Integer routeTransportId) {
        PermitModel permitModel = permitRepository.getPermitByRouteTransportId(routeTransportId);
        fillPermitDetails(permitModel, null);
        return permitModel;
    }

    public PermitModel getPermitOfRouteTransport(Integer routeTransportId, boolean fillDetails) {
        PermitModel permitModel = permitRepository.getPermitByRouteTransportId(routeTransportId);
        if (fillDetails) {
            fillPermitDetails(permitModel, null);
        }
        return permitModel;
    }

    //returns all bridges if routeIdToMaxTransportNumberMap null, other wise with next available trasportnumber given per route in routeIdToMaxTransportNumberMap
    private void fillPermitDetails(PermitModel permitModel, Map<Integer, Integer> routeIdToMaxTransportNumberMap) {
        if (permitModel != null) {
            if (permitModel.getAxleChart() != null) {
                List<AxleModel> axles = axleRepository.getAxlesOfChart(permitModel.getAxleChart().getId());
                permitModel.getAxleChart().setAxles(axles);
            }

            List<VehicleModel> vehicles = vehicleRepository.getVehiclesOfPermit(permitModel.getId());
            permitModel.setVehicles(vehicles);

            List<RouteModel> routes = routeRepository.getRoutesByPermitId(permitModel.getId());
            permitModel.setRoutes(routes);

            // The transport company UI needs the route bridges for all routes in the permit
            // TODO - if this returns too much data, add this as a separate method in RouteController
            if (permitModel.getRoutes() != null) {
                permitModel.getRoutes().forEach(routeModel -> {
                    Integer routeMaxTrasportNumber = routeIdToMaxTransportNumberMap == null ? null : routeIdToMaxTransportNumberMap.get(routeModel.getId());
                    List<RouteBridgeModel> routeBridgeModels = routeMaxTrasportNumber == null ? routeBridgeRepository.getRouteBridges(routeModel.getId()) : routeBridgeRepository.getRouteBridges(routeModel.getId(), routeMaxTrasportNumber + 1);
                    routeModel.setRouteBridges(routeBridgeModels);
                });
            }
        }
    }

    public void getPermitPdf(HttpServletResponse response, @RequestParam String objectKey) throws IOException {
        String decodedKey = new String(Base64.getDecoder().decode(objectKey));

        if (activeProfile.equals("local")) {
            // Get from local file system
            String filename = decodedKey.substring(decodedKey.lastIndexOf("/"));

            File inputFile = new File("/", filename);
            if (inputFile.exists()) {
                response.setContentType("application/pdf");
                OutputStream out = response.getOutputStream();
                FileInputStream in = new FileInputStream(inputFile);
                IOUtils.copy(in, out);
                out.close();
                in.close();
            }
        } else {
            // Get from AWS
            byte[] pdf = awss3Client.download(decodedKey, awss3Client.getPermitBucketName());
            if (pdf != null) {
                response.setContentType("application/pdf");
                OutputStream out = response.getOutputStream();
                ByteArrayInputStream in = new ByteArrayInputStream(pdf);
                IOUtils.copy(in, out);
                out.close();
                in.close();
            }
        }
    }
}
