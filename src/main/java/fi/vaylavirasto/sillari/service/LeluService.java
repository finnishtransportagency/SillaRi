package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.api.lelu.LeluDTOMapper;
import fi.vaylavirasto.sillari.api.lelu.LeluPermitDTO;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LeluService {
    private static final Logger logger = LogManager.getLogger();
    private final LeluDTOMapper dtoMapper = Mappers.getMapper(LeluDTOMapper.class);

    private PermitRepository permitRepository;

    @Autowired
    public LeluService(PermitRepository permitRepository) {
        this.permitRepository = permitRepository;
    }

    public void createOrUpdatePermit(LeluPermitDTO permitDTO) {
        logger.debug(permitDTO);
        PermitModel permitModel = dtoMapper.fromDTOToModel(permitDTO);
        logger.debug(permitModel);

        Integer permitId = permitRepository.getPermitIdByPermitNumber(permitModel.getPermitNumber());
        logger.debug(permitId);

        // TODO fetch companyId by customer business ID
        // If company is found, set companyId to permit
        // If not, create new company with business ID and name

        if (permitId != null) {
            updatePermit(permitId, permitModel);
        } else {
            createPermit(permitModel);
        }
    }

    private void createPermit(PermitModel permitModel) {
        permitRepository.createPermit(permitModel);
        // TODO
        // Insert new permit and all child records

        // Bridges still unclear - probably get bridgeId with OID from Sillari bridge list and add id to route bridges?
        // What to do if bridge is not found?
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
