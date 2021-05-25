package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.SupervisionMapper;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class SupervisionRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public SupervisionModel getSupervisionById(Integer id) {
        return dsl.select().from(SupervisionMapper.supervision)
                .leftJoin(SupervisionMapper.supervisionStatus)
                .on(SupervisionMapper.supervision.ID.eq(SupervisionMapper.supervisionStatus.SUPERVISION_ID))
                .where(SupervisionMapper.supervision.ID.eq(id))
                .orderBy(SupervisionMapper.supervisionStatus.TIME.desc())
                .limit(1).fetchOne(new SupervisionMapper());
    }

    public SupervisionModel getSupervisionByRouteBridgeId(Integer routeBridgeId) {
        return dsl.select().from(SupervisionMapper.supervision)
                .leftJoin(SupervisionMapper.supervisionStatus)
                .on(SupervisionMapper.supervision.ID.eq(SupervisionMapper.supervisionStatus.SUPERVISION_ID))
                .where(SupervisionMapper.supervision.ROUTE_BRIDGE_ID.eq(routeBridgeId))
                .orderBy(SupervisionMapper.supervisionStatus.TIME.desc())
                .limit(1).fetchOne(new SupervisionMapper());
    }

}
