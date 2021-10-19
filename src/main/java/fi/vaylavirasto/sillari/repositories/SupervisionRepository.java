package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.BridgeMapper;
import fi.vaylavirasto.sillari.mapper.RouteBridgeMapper;
import fi.vaylavirasto.sillari.mapper.SupervisionMapper;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import fi.vaylavirasto.sillari.util.TableAlias;
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
        return dsl.selectFrom(TableAlias.supervision)
                .where(TableAlias.supervision.ID.eq(id))
                .fetchOne(new SupervisionMapper());
    }
    public List<SupervisionModel> getSupervisionsByRouteBridgeId(Integer routeBridgeId) {
        return dsl.selectFrom(TableAlias.supervision)
                .where(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(routeBridgeId))
                .fetch(new SupervisionMapper());
    }

    public List<SupervisionModel> getSupervisionsByRouteTransportId(Integer routeTransportId) {
        return dsl.select().from(TableAlias.supervision)
                .where(TableAlias.supervision.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .fetch(new SupervisionMapper());
    }

    public List<SupervisionModel> getSupervisionsBySupervisorUsername(String username) {
        return dsl.select().from(TableAlias.supervision)
                .innerJoin(TableAlias.supervisionSupervisor).on(TableAlias.supervision.ID.eq(TableAlias.supervisionSupervisor.SUPERVISION_ID))
                .innerJoin(TableAlias.routeTransport).on(TableAlias.supervision.ROUTE_TRANSPORT_ID.eq(TableAlias.routeTransport.ID))
                .innerJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .innerJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .innerJoin(TableAlias.route).on(TableAlias.routeBridge.ROUTE_ID.eq(TableAlias.route.ID))
                .where(TableAlias.supervisionSupervisor.USERNAME.eq(username))
                .orderBy(TableAlias.supervision.PLANNED_TIME)
                .fetch(new SupervisionMapper());
    }

    public Integer createSupervision(SupervisionModel supervisionModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> supervisionIdResult = ctx.insertInto(TableAlias.supervision,
                            TableAlias.supervision.ROUTE_BRIDGE_ID,
                            TableAlias.supervision.ROUTE_TRANSPORT_ID,
                            TableAlias.supervision.PLANNED_TIME,
                            TableAlias.supervision.SUPERVISOR_TYPE,
                            TableAlias.supervision.CONFORMS_TO_PERMIT
                    ).values(
                            supervisionModel.getRouteBridgeId(),
                            supervisionModel.getRouteTransportId(),
                            supervisionModel.getPlannedTime(),
                            supervisionModel.getSupervisorType().toString(),
                            false)
                    .returningResult(TableAlias.supervision.ID)
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

            ctx.update(TableAlias.supervision)
                    .set(TableAlias.supervision.ROUTE_TRANSPORT_ID, supervisionModel.getRouteTransportId())
                    .set(TableAlias.supervision.PLANNED_TIME, supervisionModel.getPlannedTime())
                    .set(TableAlias.supervision.CONFORMS_TO_PERMIT, supervisionModel.getConformsToPermit())
                    .set(TableAlias.supervision.SUPERVISOR_TYPE, supervisionModel.getSupervisorType().toString())
                    .where(TableAlias.supervision.ID.eq(supervisionModel.getId()))
                    .execute();

            supervisorRepository.deleteSupervisionSupervisors(ctx, supervisionModel.getId());
            supervisionModel.getSupervisors().forEach(supervisorModel -> {
                supervisorRepository.insertSupervisionSupervisor(ctx, supervisionModel.getId(), supervisorModel.getId(), supervisorModel.getPriority());
            });
        });
    }

}
