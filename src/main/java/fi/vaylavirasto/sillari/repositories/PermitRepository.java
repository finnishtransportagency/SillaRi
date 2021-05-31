package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.PermitMapper;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.SupervisionMapper;
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
        return dsl.select().from(PermitMapper.permit)
                .leftJoin(PermitMapper.axleChart)
                .on(PermitMapper.permit.ID.eq(PermitMapper.axleChart.PERMIT_ID))
                .leftJoin(PermitMapper.transportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.transportDimensions.PERMIT_ID))
                .where(PermitMapper.permit.COMPANY_ID.eq(companyId))
                .fetch(new PermitMapper());
    }
    public PermitModel getPermit(Integer id) {
        return dsl.select().from(PermitMapper.permit)
                .leftJoin(PermitMapper.axleChart)
                .on(PermitMapper.permit.ID.eq(PermitMapper.axleChart.PERMIT_ID))
                .leftJoin(PermitMapper.transportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.transportDimensions.PERMIT_ID))
                .where(PermitMapper.permit.ID.eq(id))
                .fetchOne(new PermitMapper());
    }

}
