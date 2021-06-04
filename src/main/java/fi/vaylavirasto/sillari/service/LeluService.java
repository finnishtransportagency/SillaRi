package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.api.lelu.LeluDTOMapper;
import fi.vaylavirasto.sillari.api.lelu.LeluPermitDTO;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import fi.vaylavirasto.sillari.repositories.CompanyRepository;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeluService {
    private static final Logger logger = LogManager.getLogger();
    private final LeluDTOMapper dtoMapper = Mappers.getMapper(LeluDTOMapper.class);

    private PermitRepository permitRepository;
    private CompanyRepository companyRepository;
    private BridgeRepository bridgeRepository;

    @Autowired
    public LeluService(PermitRepository permitRepository, CompanyRepository companyRepository, BridgeRepository bridgeRepository) {
        this.permitRepository = permitRepository;
        this.companyRepository = companyRepository;
        this.bridgeRepository = bridgeRepository;
    }

    public void createOrUpdatePermit(LeluPermitDTO permitDTO) {
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
            updatePermit(permitId, permitModel);
        } else {
            logger.debug("Permit not found with id {}, create new", permitId);

            // Insert new permit and all child records
            // Missing route addresses (not yet in lelu model)
            permitRepository.createPermit(permitModel);
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

    private void updatePermit(Integer permitId, PermitModel permitModel) {
        // TODO
        // Update permit record with new data

        // Fetch routes from DB with route leluId
        // If route is still in permit data, update route data BUT keep geometry. Delete route bridges.
        // If route is NOT found, delete all route records and route bridges.

        // Delete all other child records (vehicle, axle chart, axles, transport dimensions)
        // Insert new child records (including route bridges and possible new routes not already in DB)
    }

}
