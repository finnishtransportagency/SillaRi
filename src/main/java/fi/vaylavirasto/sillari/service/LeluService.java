package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.api.lelu.LeluDTOMapper;
import fi.vaylavirasto.sillari.api.lelu.LeluPermitDTO;
import fi.vaylavirasto.sillari.api.lelu.LeluPermitResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.LeluPermitStatus;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import fi.vaylavirasto.sillari.repositories.CompanyRepository;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import fi.vaylavirasto.sillari.repositories.RouteRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeluService {
    private static final Logger logger = LogManager.getLogger();
    private final LeluDTOMapper dtoMapper = Mappers.getMapper(LeluDTOMapper.class);

    private PermitRepository permitRepository;
    private CompanyRepository companyRepository;
    private RouteRepository routeRepository;
    private BridgeRepository bridgeRepository;

    @Autowired
    public LeluService(PermitRepository permitRepository, CompanyRepository companyRepository, RouteRepository routeRepository, BridgeRepository bridgeRepository) {
        this.permitRepository = permitRepository;
        this.companyRepository = companyRepository;
        this.routeRepository = routeRepository;
        this.bridgeRepository = bridgeRepository;
    }

    public LeluPermitResponseDTO createOrUpdatePermit(LeluPermitDTO permitDTO) {
        LeluPermitResponseDTO response = new LeluPermitResponseDTO(permitDTO.getNumber(), LocalDateTime.now(ZoneId.of("Europe/Helsinki")));

        PermitModel permitModel = dtoMapper.fromDTOToModel(permitDTO);
        logger.debug("Permit mapped from LeLu model: {}", permitModel);

        // Fetch company from DB with business ID. If not found, insert new company.
        Integer companyId = getCompanyIdByBusinessId(permitModel.getCompany());
        permitModel.setCompanyId(companyId);

        // Find bridges with OID from DB and set corresponding bridgeIds to routeBridges
        setBridgeIdsToRouteBridges(permitModel);

        Integer permitId = permitRepository.getPermitIdByPermitNumber(permitModel.getPermitNumber());

        if (permitId != null) {
            logger.debug("Permit with id {} found, update", permitId);

            permitModel.setId(permitId);
            updatePermit(permitModel);

            response.setPermitId(permitId);
            response.setStatus(LeluPermitStatus.UPDATED);
            return response;
        } else {
            logger.debug("Permit not found with id {}, create new", permitId);

            // Insert new permit and all child records
            // Missing route addresses (not yet in lelu model)
            Integer permitModelId = permitRepository.createPermit(permitModel);

            response.setPermitId(permitModelId);
            response.setStatus(LeluPermitStatus.CREATED);
            return response;
        }
    }

    private Integer getCompanyIdByBusinessId(CompanyModel companyModel) {
        Integer companyId = companyRepository.getCompanyIdByBusinessId(companyModel.getBusinessId());
        if (companyId == null) {
            logger.debug("Create new company with business ID {}", companyModel.getBusinessId());
            companyId = companyRepository.createCompany(companyModel);
        }
        return companyId;
    }


    private void setBridgeIdsToRouteBridges(PermitModel permitModel) {
        // Get bridge IDs for unique bridges in routes
        Map<String, Integer> idOIDMap = getBridgeIdsWithOIDs(permitModel);

        for (RouteModel route : permitModel.getRoutes()) {
            for (RouteBridgeModel routeBridge : route.getRouteBridges()) {
                Integer bridgeId = idOIDMap.get(routeBridge.getBridge().getOid());
                if (bridgeId != null) {
                    routeBridge.setBridgeId(bridgeId);
                } else {
                    // TODO What to do if bridge is not found?
                    logger.warn("Bridge missing from db with oid {}", routeBridge.getBridge().getOid());
                }
            }
        }
    }

    private Map<String, Integer> getBridgeIdsWithOIDs(PermitModel permitModel) {
        List<String> allOIDs = new ArrayList<>();
        for (RouteModel routeModel : permitModel.getRoutes()) {
            allOIDs.addAll(routeModel.getRouteBridges().stream()
                    .map(routeBridge -> routeBridge.getBridge().getOid())
                    .collect(Collectors.toList()));
        }
        // Filter duplicates
        List<String> uniqueOIDs = new ArrayList<>(new HashSet<>(allOIDs));
        return bridgeRepository.getBridgeIdsWithOIDs(uniqueOIDs);
    }

    private void updatePermit(PermitModel permitModel) {
        // Check if old routes are all included in permit, routes not included anymore should be deleted
        // Routes with same lelu ID should be updated and not inserted as new, set existing sillari ID to those route models
        Map<Long, Integer> oldRouteIdLeluIdMap = routeRepository.getRouteIdsWithLeluIds(permitModel.getId());
        List<Long> newLeluIds = permitModel.getRoutes().stream().map(RouteModel::getLeluId).collect(Collectors.toList());

        List<Integer> routeIdsToRemove = new ArrayList<>();

        for (Long oldLeluId : oldRouteIdLeluIdMap.keySet()) {
            if (!newLeluIds.contains(oldLeluId)) {
                routeIdsToRemove.add(oldRouteIdLeluIdMap.get(oldLeluId));
            }
        }

        for (RouteModel newRoute : permitModel.getRoutes()) {
            if (oldRouteIdLeluIdMap.containsKey(newRoute.getLeluId())) {
                newRoute.setId(oldRouteIdLeluIdMap.get(newRoute.getLeluId()));
            }
        }

        permitRepository.updatePermit(permitModel, routeIdsToRemove);
    }

}
