package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.SimpleSupervisionMapper;
import fi.vaylavirasto.sillari.mapper.SupervisionMapper;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
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
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;

    public SupervisionModel getSupervisionById(Integer id) {
        return dsl.selectFrom(SimpleSupervisionMapper.supervision)
                .where(SimpleSupervisionMapper.supervision.ID.eq(id))
                .fetchOne(new SimpleSupervisionMapper());
    }
    public List<SupervisionModel> getSupervisionsByRouteBridgeId(Integer routeBridgeId) {
        return dsl.selectFrom(SimpleSupervisionMapper.supervision)
                .where(SimpleSupervisionMapper.supervision.ROUTE_BRIDGE_ID.eq(routeBridgeId))
                .fetch(new SimpleSupervisionMapper());
    }

    public List<SupervisionModel> getSupervisionsByRouteTransportId(Integer routeTransportId) {
        return dsl.select().from(SimpleSupervisionMapper.supervision)
                .where(SimpleSupervisionMapper.supervision.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .fetch(new SimpleSupervisionMapper());
    }

    public List<SupervisionModel> getSupervisionsBySupervisorUsername(String username) {
        return dsl.select().from(SupervisionMapper.supervision)
                .innerJoin(SupervisionMapper.supervisionSupervisor).on(SupervisionMapper.supervision.ID.eq(SupervisionMapper.supervisionSupervisor.SUPERVISION_ID))
                .innerJoin(SupervisionMapper.routeTransport).on(SupervisionMapper.supervision.ROUTE_TRANSPORT_ID.eq(SupervisionMapper.routeTransport.ID))
                .innerJoin(SupervisionMapper.routeBridge).on(SupervisionMapper.supervision.ROUTE_BRIDGE_ID.eq(SupervisionMapper.routeBridge.ID))
                .innerJoin(SupervisionMapper.bridge).on(SupervisionMapper.routeBridge.BRIDGE_ID.eq(SupervisionMapper.bridge.ID))
                .innerJoin(SupervisionMapper.route).on(SupervisionMapper.routeBridge.ROUTE_ID.eq(SupervisionMapper.route.ID))
                .innerJoin(SupervisionMapper.permit).on(SupervisionMapper.route.PERMIT_ID.eq(SupervisionMapper.permit.ID))
                .where(SupervisionMapper.supervisionSupervisor.USERNAME.eq(username))
                .orderBy(SupervisionMapper.supervision.PLANNED_TIME)
                .fetch(new SupervisionMapper());
    }

    public Integer createSupervision(SupervisionModel supervisionModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> supervisionIdResult = ctx.insertInto(SimpleSupervisionMapper.supervision,
                            SimpleSupervisionMapper.supervision.ROUTE_BRIDGE_ID,
                            SimpleSupervisionMapper.supervision.ROUTE_TRANSPORT_ID,
                            SimpleSupervisionMapper.supervision.PLANNED_TIME,
                            SimpleSupervisionMapper.supervision.SUPERVISOR_TYPE,
                            SimpleSupervisionMapper.supervision.CONFORMS_TO_PERMIT
                    ).values(
                            supervisionModel.getRouteBridgeId(),
                            supervisionModel.getRouteTransportId(),
                            supervisionModel.getPlannedTime(),
                            supervisionModel.getSupervisorType().toString(),
                            false)
                    .returningResult(SimpleSupervisionMapper.supervision.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer supervisionId = supervisionIdResult != null ? supervisionIdResult.value1() : null;
            supervisionModel.setId(supervisionId);

            supervisionModel.getSupervisors().forEach(supervisorModel -> {
                supervisorRepository.insertSupervisionSupervisor(ctx, supervisionId, supervisorModel.getId(), supervisorModel.getPriority());
            });

            supervisionStatusRepository.insertSupervisionStatus(ctx, supervisionId, SupervisionStatusType.PLANNED);

            return supervisionId;
        });
    }

    public void updateSupervision(SupervisionModel supervisionModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(SimpleSupervisionMapper.supervision)
                    .set(SimpleSupervisionMapper.supervision.ROUTE_TRANSPORT_ID, supervisionModel.getRouteTransportId())
                    .set(SimpleSupervisionMapper.supervision.PLANNED_TIME, supervisionModel.getPlannedTime())
                    .set(SimpleSupervisionMapper.supervision.CONFORMS_TO_PERMIT, supervisionModel.getConformsToPermit())
                    .set(SimpleSupervisionMapper.supervision.SUPERVISOR_TYPE, supervisionModel.getSupervisorType().toString())
                    .where(SimpleSupervisionMapper.supervision.ID.eq(supervisionModel.getId()))
                    .execute();

            supervisorRepository.deleteSupervisionSupervisors(ctx, supervisionModel.getId());
            supervisionModel.getSupervisors().forEach(supervisorModel -> {
                supervisorRepository.insertSupervisionSupervisor(ctx, supervisionModel.getId(), supervisorModel.getId(), supervisorModel.getPriority());
            });
        });
    }

}
