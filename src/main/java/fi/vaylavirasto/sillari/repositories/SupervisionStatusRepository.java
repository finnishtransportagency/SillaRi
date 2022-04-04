package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.SupervisionStatusMapper;
import fi.vaylavirasto.sillari.model.SupervisionStatusModel;
import fi.vaylavirasto.sillari.model.tables.records.SupervisionStatusRecord;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class SupervisionStatusRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public List<SupervisionStatusModel> getSupervisionStatusHistory(Integer supervisionId) {
        return dsl.selectFrom(TableAlias.supervisionStatus)
                .where(TableAlias.supervisionStatus.SUPERVISION_ID.eq(supervisionId))
                .orderBy(TableAlias.supervisionStatus.TIME.desc())
                .fetch(new SupervisionStatusMapper());
    }

    public Map<Integer, List<SupervisionStatusModel>> getSupervisionStatusHistories(List<Integer> supervisionIds) {
        return dsl.selectFrom(TableAlias.supervisionStatus)
                .where(TableAlias.supervisionStatus.SUPERVISION_ID.in(supervisionIds))
                .orderBy(TableAlias.supervisionStatus.SUPERVISION_ID, TableAlias.supervisionStatus.TIME.desc())
                .fetchGroups(SupervisionStatusRecord::getSupervisionId, new SupervisionStatusMapper());
    }

    public void insertSupervisionStatus(SupervisionStatusModel status) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.insertInto(TableAlias.supervisionStatus,
                            TableAlias.supervisionStatus.SUPERVISION_ID,
                            TableAlias.supervisionStatus.STATUS,
                            TableAlias.supervisionStatus.TIME,
                            TableAlias.supervisionStatus.REASON,
                            TableAlias.supervisionStatus.USERNAME
                    ).values(
                            status.getSupervisionId(),
                            String.valueOf(status.getStatus()),
                            status.getTime(),
                            status.getReason(),
                            status.getUsername())
                    .execute();
        });
    }

    public void deleteSupervisionStatuses(DSLContext ctx, Integer supervisionId) {
        ctx.deleteFrom(TableAlias.supervisionStatus)
                .where(TableAlias.supervisionStatus.SUPERVISION_ID.eq(supervisionId))
                .execute();
    }
}
