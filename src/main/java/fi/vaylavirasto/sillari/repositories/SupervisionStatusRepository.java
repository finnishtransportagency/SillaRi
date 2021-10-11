package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.SimpleSupervisionMapper;
import fi.vaylavirasto.sillari.model.SupervisionStatusMapper;
import fi.vaylavirasto.sillari.model.SupervisionStatusModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public class SupervisionStatusRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public List<SupervisionStatusModel> getSupervisionStatusHistory(Integer supervisionId) {
        return dsl.selectFrom(SupervisionStatusMapper.supervisionStatus)
                .where(SupervisionStatusMapper.supervisionStatus.SUPERVISION_ID.eq(supervisionId))
                .orderBy(SupervisionStatusMapper.supervisionStatus.TIME.desc())
                .fetch(new SupervisionStatusMapper());
    }

    public void insertSupervisionStatus(Integer supervisionId, SupervisionStatusType statusType) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);
            insertSupervisionStatus(ctx, supervisionId, statusType);
        });
    }

    public void insertSupervisionStatus(DSLContext ctx, Integer supervisionId, SupervisionStatusType statusType) {
        ctx.insertInto(SupervisionStatusMapper.supervisionStatus,
                        SupervisionStatusMapper.supervisionStatus.SUPERVISION_ID,
                        SupervisionStatusMapper.supervisionStatus.STATUS,
                        SupervisionStatusMapper.supervisionStatus.TIME
                ).values(
                        supervisionId,
                        String.valueOf(statusType),
                        OffsetDateTime.now())
                .execute();
    }

}
