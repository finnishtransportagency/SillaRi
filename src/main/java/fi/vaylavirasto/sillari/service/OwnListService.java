package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.OwnListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OwnListService {
    @Autowired
    OwnListRepository ownListRepository;

    public List<SupervisionModel> getOwnList(String contractBusinessId) {
        return ownListRepository.getOwnListSupervisions(contractBusinessId);
    }

    public void addToList(String contractBusinessId, Integer supervisionId){
        ownListRepository.addToList(contractBusinessId, supervisionId);
    }

}
