package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.OwnListModel;
import fi.vaylavirasto.sillari.repositories.OwnlistRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OwnListService {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    OwnlistRepository ownlistRepository;

    public OwnListModel getOwnlist(String username, String listname) {
        return ownlistRepository.getOwnlist(username, listname);
    }
}
