package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.dto.CompanyTransportsDTO;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.repositories.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CompanyService {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    PermitRepository permitRepository;
    @Autowired
    RouteRepository routeRepository;
    @Autowired
    RouteTransportRepository transportRepository;
    @Autowired
    RouteTransportStatusRepository transportStatusRepository;

    public CompanyModel getCompany(Integer id) {
        CompanyModel company = companyRepository.getCompanyById(id);
        company.setPermits(permitRepository.getPermitsByCompanyId(id));
        for (PermitModel permitModel : company.getPermits()) {
            permitModel.setRoutes(routeRepository.getRoutesByPermitId(permitModel.getId()));
        }
        return company;
    }

    public CompanyModel getCompanyByBusinessId(String businessId) {
        CompanyModel company = companyRepository.getCompanyByBusinessId(businessId);
        if (company == null) {
            return null;
        }
        company.setPermits(permitRepository.getPermitsByCompanyId(company.getId()));
        for (PermitModel permitModel : company.getPermits()) {
            permitModel.setRoutes(routeRepository.getRoutesByPermitId(permitModel.getId()));
        }
        return company;
    }

    public CompanyModel getCompanyByRouteTransportId(Integer routeTransportId) {
        return companyRepository.getCompanyByRouteTransportId(routeTransportId);
    }

    public CompanyModel getCompanyByPermitId(Integer permitId) {
        return companyRepository.getCompanyByPermitId(permitId);
    }

    public CompanyModel getCompanyByRouteBridgeId(Integer routeBridgeId) {
        return companyRepository.getCompanyByRouteBridgeId(routeBridgeId);
    }

    public CompanyModel getCompanyByRouteId(Integer routeId) {
        return companyRepository.getCompanyByRouteId(routeId);
    }

    public List<CompanyTransportsDTO> getCompanyTransportListOfSupervisor(String username) {
        List<CompanyTransportsDTO> companyTransports = new ArrayList<>();

        // Get route transports where the supervisor has supervisions
        List<RouteTransportModel> routeTransports = transportRepository.getRouteTransportsOfSupervisor(username);

        if (routeTransports != null && !routeTransports.isEmpty()) {
            for (RouteTransportModel transport : routeTransports) {
                // Set current transport status and departure times
                transport.setStatusHistory(transportStatusRepository.getTransportStatusHistory(transport.getId()));

                // Set routes, permits and companies
                RouteModel route = routeRepository.getRoute(transport.getRouteId());
                transport.setRoute(route);

                if (route != null) {
                    PermitModel permit = permitRepository.getPermit(route.getPermitId());
                    route.setPermit(permit);

                    if (permit != null) {
                        CompanyModel company = companyRepository.getCompanyById(permit.getCompanyId());
                        permit.setCompany(company);
                    }
                }
            }

            // Group transports by company (compares only the business_id of the company)
            Map<CompanyModel, List<RouteTransportModel>> companyTransportMap = routeTransports.stream()
                    .collect(Collectors.groupingBy(transport -> transport.getRoute().getPermit().getCompany()));

            companyTransportMap.forEach((companyModel, transports) -> {
                CompanyTransportsDTO companyTransportsDTO = new CompanyTransportsDTO();
                companyTransportsDTO.setCompany(companyModel);
                companyTransportsDTO.setTransports(transports);
                companyTransportsDTO.setTransportDepartureTimes(transports);

                companyTransports.add(companyTransportsDTO);
            });
        }
        return companyTransports;
    }


}
