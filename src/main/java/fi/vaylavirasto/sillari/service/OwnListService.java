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

    public void saveOwnList(String businessId, String username, String listName, String list) {
        logger.debug("saveOwnList " + username+listName+list);
        if(getOwnlist(username,listName ) != null){
            ownlistRepository.updateOwnlist(businessId, username, listName, list);
        }
        else {
            ownlistRepository.saveOwnlist(businessId, username, listName, list);
        }

    }
}
