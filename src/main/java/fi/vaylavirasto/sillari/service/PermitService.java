package fi.vaylavirasto.sillari.service;

import com.amazonaws.util.IOUtils;
import fi.vaylavirasto.sillari.aws.AWSS3Client;
import fi.vaylavirasto.sillari.model.AxleModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.VehicleModel;
import fi.vaylavirasto.sillari.repositories.AxleRepository;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
import fi.vaylavirasto.sillari.repositories.VehicleRepository;
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
    AWSS3Client awss3Client;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    public PermitModel getPermit(Integer permitId) {
        PermitModel permitModel = permitRepository.getPermit(permitId);
        fillPermitDetails(permitModel);
        return permitModel;
    }

    public PermitModel getPermitOfRouteTransport(Integer routeTransportId) {
        PermitModel permitModel = permitRepository.getPermitByRouteTransportId(routeTransportId);
        fillPermitDetails(permitModel);
        return permitModel;
    }

    private void fillPermitDetails(PermitModel permitModel) {
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
                    List<RouteBridgeModel> routeBridgeModels = routeBridgeRepository.getRouteBridges(routeModel.getId());
                    routeModel.setRouteBridges(routeBridgeModels);
                });
            }
        }
    }

    public void getPermitPdf(HttpServletResponse response, @RequestParam String objectKey) throws IOException {
       // String decodedKey = new String(Base64.getDecoder().decode(objectKey));
        String decodedKey =objectKey;
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
            byte[] pdf = awss3Client.download(decodedKey, AWSS3Client.SILLARI_PERMIT_PDF_BUCKET);
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
