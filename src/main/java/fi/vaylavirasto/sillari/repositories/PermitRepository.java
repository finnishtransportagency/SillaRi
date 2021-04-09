package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.PermitMapper;
import fi.vaylavirasto.sillari.model.PermitModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PermitRepository {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    private DSLContext dsl;

    public List<PermitModel> getCompanysPermits(Integer companyId) {
        return dsl.selectFrom(PermitMapper.permit)
                .where(PermitMapper.permit.COMPANY_ID.eq(companyId))
                .fetch(new PermitMapper());
    }
    public PermitModel getPermit(Integer id) {
        return dsl.selectFrom(PermitMapper.permit)
                .where(PermitMapper.permit.ID.eq(id))
                .fetchOne(new PermitMapper());
    }
}
