package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.repositories.PermitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PermitService {
    @Autowired
        PermitRepository     permitRepository;

    public PermitModel getPermit(Integer permitId) {
        return permitRepository.getPermit(permitId);
    }
}
