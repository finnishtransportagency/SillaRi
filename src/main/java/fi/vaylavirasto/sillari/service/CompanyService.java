package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.dto.CompanyTransportsDTO;
import fi.vaylavirasto.sillari.dto.DTOMapper;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.repositories.CompanyRepository;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
import fi.vaylavirasto.sillari.repositories.RouteTransportRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mapstruct.factory.Mappers;
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

    private final DTOMapper dtoMapper = Mappers.getMapper(DTOMapper.class);

    public List<CompanyTransportsDTO> getCompanyTransportListOfSupervisor(String username) {
        List<CompanyTransportsDTO> companyTransports = new ArrayList<>();

        // Get route transports where the supervisor has supervisions
        List<RouteTransportModel> routeTransports = transportRepository.getRouteTransportsOfSupervisor(username);

        if (routeTransports != null && !routeTransports.isEmpty()) {
            // Group transports by company (compares only the business_id of the company)
            Map<CompanyModel, List<RouteTransportModel>> companyTransportMap = routeTransports.stream().collect(Collectors.groupingBy(transport -> transport.getRoute().getPermit().getCompany()));

            companyTransportMap.forEach((companyModel, transports) -> {
                CompanyTransportsDTO companyTransportsDTO = dtoMapper.fromModelToDTO(companyModel);
                companyTransportsDTO.setTransports(transports);
                companyTransportsDTO.setTransportDepartureTimes(transports);

                companyTransports.add(companyTransportsDTO);
            });
        }
        logger.debug("companies with transports: " + companyTransports);
        return companyTransports;
    }

    public CompanyModel getCompany(Integer id) {
        CompanyModel company = companyRepository.getCompanyById(id);
        company.setPermits(permitRepository.getPermitsByCompanyId(id));
        for (PermitModel permitModel : company.getPermits()) {
            permitModel.setRoutes(routeRepository.getRoutesByPermitId(permitModel.getId()));
        }
        return company;
    }
}
