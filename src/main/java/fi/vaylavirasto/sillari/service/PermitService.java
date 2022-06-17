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
import java.util.stream.Collectors;

@Service
public class PermitService {
    @Autowired
    PermitRepository permitRepository;
    @Autowired
    CompanyRepository companyRepository;
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
    @Autowired
    RouteTransportNumberService routeTransportNumberService;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    private static final Logger logger = LogManager.getLogger();

    public PermitModel getPermit(Integer permitId) {
        return permitRepository.getPermit(permitId);
    }

    public PermitModel getPermitOfRouteTransport(Integer routeTransportId) {
        return permitRepository.getPermitByRouteTransportId(routeTransportId);
    }

    public PermitModel getPermitWithOnlyNextAvailableTransportInstances(Integer permitId) {
        PermitModel permitModel = permitRepository.getPermit(permitId);
        if (permitModel != null) {
            if (permitModel.getCompanyId() != null) {
                permitModel.setCompany(companyRepository.getCompanyById(permitModel.getCompanyId()));
            }

            fillVehiclesAndAxles(permitModel);
            fillRouteDetails(permitModel, null);
        }
        return permitModel;
    }

    public PermitModel getPermitOfRouteTransportForTransportInstance(Integer routeTransportId) {
        PermitModel permitModel = permitRepository.getPermitByRouteTransportId(routeTransportId);
        RouteTransportModel routeTransport = routeTransportRepository.getRouteTransportById(routeTransportId);

        fillVehiclesAndAxles(permitModel);
        fillRouteDetails(permitModel, routeTransport);
        return permitModel;
    }

    // Fills permit routes with bridges with next available transport number given per route
    private void fillRouteDetails(PermitModel permit, RouteTransportModel routeTransport) {
        List<RouteModel> routes = routeRepository.getRoutesByPermitId(permit.getId());

        if (permit.getRoutes() != null) {
            // Get all transport numbers for route, including possible other permit versions with the same route lelu id
            Map<Long, List<RouteTransportNumberModel>> routeTransportNumbers = routeTransportNumberService.getRouteTransportNumbersForRoutes(routes, permit.getPermitNumber());

            for (RouteModel route : routes) {
                Integer routeId = route.getId();
                route.setRouteTransportNumbers(routeTransportNumbers.get(route.getLeluId()));

                Integer transportNumber;
                // Get routeBridges with selected transportNumber per route.
                // If the route is already selected for the route transport instance, use the reserved transport number for that route.
                // Otherwise, select the next available transportNumber for the route.
                if (routeTransport != null && routeId.equals(routeTransport.getRouteId())) {
                    transportNumber = routeTransport.getTransportNumber();
                } else {
                    transportNumber = routeTransportNumberService.getNextAvailableTransportNumber(route, permit.getPermitNumber());
                }

                logger.debug("getting permit {} route {} bridges with transport number: {}", permit.getPermitNumber(), route.getName(), transportNumber);
                if (transportNumber != null && transportNumber > 0) {
                    List<RouteBridgeModel> routeBridges = routeBridgeRepository.getRouteBridges(routeId, transportNumber);
                    route.setRouteBridges(routeBridges);
                }
            }

            permit.setRoutes(routes);
        }
    }

    private void fillVehiclesAndAxles(PermitModel permitModel) {
        if (permitModel.getAxleChart() != null) {
            List<AxleModel> axles = axleRepository.getAxlesOfChart(permitModel.getAxleChart().getId());
            permitModel.getAxleChart().setAxles(axles);
        }

        List<VehicleModel> vehicles = vehicleRepository.getVehiclesOfPermit(permitModel.getId());
        permitModel.setVehicles(vehicles);
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
