package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.SupervisionMapper;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionReportModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import fi.vaylavirasto.sillari.model.SupervisorMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;

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


    public Integer createSupervision(SupervisionModel supervisionModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> supervisionIdResult = ctx.insertInto(SupervisionMapper.supervision,
                            SupervisionMapper.supervision.ROUTE_BRIDGE_ID,
                            SupervisionMapper.supervision.ROUTE_TRANSPORT_ID,
                            SupervisionMapper.supervision.PLANNED_TIME,
                            SupervisionMapper.supervision.CONFORMS_TO_PERMIT
                    ).values(
                            supervisionModel.getRouteBridgeId(),
                            supervisionModel.getRouteTransportId(),
                            supervisionModel.getPlannedTime(),
                            false)
                    .returningResult(SupervisionMapper.supervision.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer supervisionId = supervisionIdResult != null ? supervisionIdResult.value1() : null;
            supervisionModel.setId(supervisionId);

            supervisionModel.getSupervisors().forEach(supervisorModel -> {
                insertSupervisionSupervisor(ctx, supervisionId, supervisorModel.getId(), supervisorModel.getPriority());
            });

            return supervisionId;
        });
    }

    private void insertSupervisionSupervisor(DSLContext ctx, Integer supervisionId, Integer supervisorId, Integer priority) {
        ctx.insertInto(SupervisorMapper.supervisionSupervisor,
                        SupervisorMapper.supervisionSupervisor.SUPERVISION_ID,
                        SupervisorMapper.supervisionSupervisor.SUPERVISOR_ID,
                        SupervisorMapper.supervisionSupervisor.PRIORITY
                ).values(
                        supervisionId,
                        supervisorId,
                        priority
                )
                .execute();
    }

    public void updateSupervision(SupervisionModel supervisionModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(SupervisionMapper.supervision)
                    .set(SupervisionMapper.supervision.ROUTE_TRANSPORT_ID, supervisionModel.getRouteTransportId())
                    .set(SupervisionMapper.supervision.PLANNED_TIME, supervisionModel.getPlannedTime())
                    .set(SupervisionMapper.supervision.CONFORMS_TO_PERMIT, supervisionModel.getConformsToPermit())
                    .where(SupervisionMapper.supervision.ID.eq(supervisionModel.getId()))
                    .execute();
        });
    }

}
