package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.api.lelu.LeluPermitDTO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class LeluService {
    private static final Logger logger = LogManager.getLogger();

    public void createOrUpdatePermit(LeluPermitDTO permitDTO) {
        // TODO
        logger.debug(permitDTO);
    }

}
