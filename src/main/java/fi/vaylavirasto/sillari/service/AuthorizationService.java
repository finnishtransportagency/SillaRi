package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.AuthorizationModel;
import fi.vaylavirasto.sillari.repositories.AuthorizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {
    @Autowired
    AuthorizationRepository authorizationRepository;

    public AuthorizationModel getAuthorization(Integer authorizationId) {
        return authorizationRepository.getAuthorization(authorizationId);
    }
}
