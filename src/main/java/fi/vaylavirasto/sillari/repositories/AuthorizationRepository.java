package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.AuthorizationMapper;
import fi.vaylavirasto.sillari.model.AuthorizationModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AuthorizationRepository {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    private DSLContext dsl;

    public List<AuthorizationModel> getCompanysAuthorizations(Integer companyId) {
        return dsl.selectFrom(AuthorizationMapper.authorization)
                .where(AuthorizationMapper.authorization.COMPANY_ID.eq(companyId))
                .fetch(new AuthorizationMapper());
    }
}
