package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.api.lelu.LeluDTOMapper;
import fi.vaylavirasto.sillari.api.lelu.LeluPermitDTO;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;

@Service
public class LeluService {
    private static final Logger logger = LogManager.getLogger();
    private final LeluDTOMapper dtoMapper = Mappers.getMapper(LeluDTOMapper.class);

    private final PermitRepository permitRepository;

    public LeluService(PermitRepository permitRepository) {
        this.permitRepository = permitRepository;
    }

    public void createOrUpdatePermit(LeluPermitDTO permitDTO) {
        // TODO
        logger.debug(permitDTO);
        PermitModel permitModel = dtoMapper.leluPermitToPermit(permitDTO);
        logger.debug(permitModel);
    }

    private void createPermit(PermitModel permitModel) {

    }

    private void updatePermit(PermitModel permitModel) {

    }

}
