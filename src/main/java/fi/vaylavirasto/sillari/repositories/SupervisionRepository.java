package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.SupervisionMapper;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SupervisionRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;
    @Autowired
    SupervisorRepository supervisorRepository;

    public SupervisionModel getSupervisionById(Integer id) {
        return dsl.selectFrom(SupervisionMapper.supervision)
                .where(SupervisionMapper.supervision.ID.eq(id))
                .fetchOne(new SupervisionMapper());
    }

    public SupervisionModel getSupervisionByRouteBridgeId(Integer routeBridgeId) {
        return dsl.selectFrom(SupervisionMapper.supervision)
                .where(SupervisionMapper.supervision.ROUTE_BRIDGE_ID.eq(routeBridgeId))
                .fetchOne(new SupervisionMapper());
    }

    public List<SupervisionModel> getSupervisionsByRouteTransportId(Integer routeTransportId) {
        return dsl.select().from(SupervisionMapper.supervision)
                .where(SupervisionMapper.supervision.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .fetch(new SupervisionMapper());
    }

    public Integer createSupervision(SupervisionModel supervisionModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> supervisionIdResult = ctx.insertInto(SupervisionMapper.supervision,
                            SupervisionMapper.supervision.ROUTE_BRIDGE_ID,
                            SupervisionMapper.supervision.ROUTE_TRANSPORT_ID,
                            SupervisionMapper.supervision.PLANNED_TIME,
                            SupervisionMapper.supervision.SUPERVISOR_TYPE,
                            SupervisionMapper.supervision.CONFORMS_TO_PERMIT
                    ).values(
                            supervisionModel.getRouteBridgeId(),
                            supervisionModel.getRouteTransportId(),
                            supervisionModel.getPlannedTime(),
                            supervisionModel.getSupervisorType().toString(),
                            false)
                    .returningResult(SupervisionMapper.supervision.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer supervisionId = supervisionIdResult != null ? supervisionIdResult.value1() : null;
            supervisionModel.setId(supervisionId);

            supervisionModel.getSupervisors().forEach(supervisorModel -> {
                supervisorRepository.insertSupervisionSupervisor(ctx, supervisionId, supervisorModel.getId(), supervisorModel.getPriority());
            });

            return supervisionId;
        });
    }

    public void updateSupervision(SupervisionModel supervisionModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(SupervisionMapper.supervision)
                    .set(SupervisionMapper.supervision.ROUTE_TRANSPORT_ID, supervisionModel.getRouteTransportId())
                    .set(SupervisionMapper.supervision.PLANNED_TIME, supervisionModel.getPlannedTime())
                    .set(SupervisionMapper.supervision.CONFORMS_TO_PERMIT, supervisionModel.getConformsToPermit())
                    .set(SupervisionMapper.supervision.SUPERVISOR_TYPE, supervisionModel.getSupervisorType().toString())
                    .where(SupervisionMapper.supervision.ID.eq(supervisionModel.getId()))
                    .execute();

            supervisorRepository.deleteSupervisionSupervisors(ctx, supervisionModel.getId());
            supervisionModel.getSupervisors().forEach(supervisorModel -> {
                supervisorRepository.insertSupervisionSupervisor(ctx, supervisionModel.getId(), supervisorModel.getId(), supervisorModel.getPriority());
            });
        });
    }

}
