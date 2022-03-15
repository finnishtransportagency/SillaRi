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
import java.util.Base64;
import java.util.Comparator;
import java.util.List;

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
        logger.debug("hellohau:"+permitId);
        Integer maxUsedTransportNumber = routeTransportRepository.getRouteTransportsByPermitId(permitId).stream().max(Comparator.comparing(RouteTransportModel::getTransportNumber)).map(rt -> rt.getTransportNumber()).orElse(null);
        logger.debug("hellohau:"+routeTransportRepository.getRouteTransportsByPermitId(permitId));
        logger.debug("hellohau:"+maxUsedTransportNumber);
        Integer nextAvailableTransportNumber = maxUsedTransportNumber == null ? 1 : maxUsedTransportNumber + 1;
        fillPermitDetails(permitModel, nextAvailableTransportNumber);
        return permitModel;
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

    //returns all bridges if trasportNumber null
    private void fillPermitDetails(PermitModel permitModel, Integer transportNumber) {
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
                    List<RouteBridgeModel> routeBridgeModels = transportNumber == null ? routeBridgeRepository.getRouteBridges(routeModel.getId()) : routeBridgeRepository.getRouteBridges(routeModel.getId(), transportNumber);
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
