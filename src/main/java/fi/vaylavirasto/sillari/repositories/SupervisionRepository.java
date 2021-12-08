package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.api.lelu.supervision.LeluRouteResponseDTO;
import fi.vaylavirasto.sillari.mapper.BridgeMapper;
import fi.vaylavirasto.sillari.mapper.RouteBridgeMapper;
import fi.vaylavirasto.sillari.mapper.SupervisionMapper;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static org.jooq.impl.DSL.exists;
import static org.jooq.impl.DSL.notExists;
import static org.jooq.impl.DSL.selectOne;

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
        return dsl.select().from(TableAlias.supervision)
                .leftJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .leftJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .where(TableAlias.supervision.ID.eq(id))
                .fetchOne(this::mapSupervisionWithRouteBridgeAndBridge);
    }

    public LeluRouteResponseDTO getSupervisionsByRouteId(Integer routeId) {
        return dsl.select().from(TableAlias.supervision)
                .where(TableAlias.supervision.ROUTE_ID.eq(routeId))
                .fetch(new SupervisionMapper());
    }

    public List<SupervisionModel> getSupervisionsByRouteTransportId(Integer routeTransportId) {
        return dsl.select().from(TableAlias.supervision)
                .where(TableAlias.supervision.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .fetch(new SupervisionMapper());
    }

    public List<SupervisionModel> getSupervisionsByRouteBridgeId(Integer routeBridgeId) {
        return dsl.select().from(TableAlias.supervision)
                .where(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(routeBridgeId))
                .fetch(new SupervisionMapper());
    }

    public List<SupervisionModel> getSupervisionsBySupervisorUsername(String username) {
        return dsl.select().from(TableAlias.supervision)
                .innerJoin(TableAlias.supervisionSupervisor).on(TableAlias.supervision.ID.eq(TableAlias.supervisionSupervisor.SUPERVISION_ID))
                .innerJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .innerJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .where(TableAlias.supervisionSupervisor.USERNAME.eq(username))
                .orderBy(TableAlias.supervision.PLANNED_TIME)
                .fetch(this::mapSupervisionWithRouteBridgeAndBridge);
    }

    public List<SupervisionModel> getSupervisionsByRouteTransportAndSupervisorUsername(Integer routeTransportId, String username) {
        return dsl.select().from(TableAlias.supervision)
                .innerJoin(TableAlias.routeTransport).on(TableAlias.supervision.ROUTE_TRANSPORT_ID.eq(TableAlias.routeTransport.ID))
                .innerJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .innerJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .innerJoin(TableAlias.supervisionSupervisor).on(TableAlias.supervision.ID.eq(TableAlias.supervisionSupervisor.SUPERVISION_ID))
                .where(TableAlias.supervisionSupervisor.USERNAME.eq(username))
                .and(TableAlias.routeTransport.ID.eq(routeTransportId))
                .orderBy(TableAlias.routeBridge.ORDINAL)
                .fetch(this::mapSupervisionWithRouteBridgeAndBridge);
    }

    public List<SupervisionModel> getFinishedButUnsignedSupervisionsBySupervisorUsername(String username) {
        return dsl.select().from(TableAlias.supervision)
                .innerJoin(TableAlias.routeTransport).on(TableAlias.supervision.ROUTE_TRANSPORT_ID.eq(TableAlias.routeTransport.ID))
                .innerJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .innerJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .innerJoin(TableAlias.supervisionSupervisor).on(TableAlias.supervision.ID.eq(TableAlias.supervisionSupervisor.SUPERVISION_ID))
                .where(TableAlias.supervisionSupervisor.USERNAME.eq(username))
                .and(exists(selectOne()
                        .from(TableAlias.supervisionStatus)
                        .where(TableAlias.supervisionStatus.SUPERVISION_ID.eq(TableAlias.supervision.ID)
                                .and(TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.FINISHED.toString())))))
                .and(notExists(selectOne()
                        .from(TableAlias.supervisionStatus)
                        .where(TableAlias.supervisionStatus.SUPERVISION_ID.eq(TableAlias.supervision.ID)
                                .and(TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.REPORT_SIGNED.toString())))))
                .fetch(this::mapSupervisionWithRouteBridgeAndBridge);
    }

    private SupervisionModel mapSupervisionWithRouteBridgeAndBridge(Record record) {
        SupervisionMapper supervisionMapper = new SupervisionMapper();
        SupervisionModel supervision = supervisionMapper.map(record);
        if (supervision != null) {
            RouteBridgeMapper routeBridgeMapper = new RouteBridgeMapper();
            RouteBridgeModel routeBridge = routeBridgeMapper.map(record);
            supervision.setRouteBridge(routeBridge);

            if (routeBridge != null) {
                BridgeMapper bridgeMapper = new BridgeMapper();
                routeBridge.setBridge(bridgeMapper.map(record));
            }
        }
        return supervision;
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
                supervisorRepository.insertSupervisionSupervisor(ctx, supervisionId, supervisorModel.getId(), supervisorModel.getPriority(), supervisorModel.getUsername());
            });

            return supervisionId;
        });
    }

    public void updateSupervision(SupervisionModel supervisionModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.supervision)
                    .set(TableAlias.supervision.PLANNED_TIME, supervisionModel.getPlannedTime())
                    .set(TableAlias.supervision.SUPERVISOR_TYPE, supervisionModel.getSupervisorType().toString())
                    .where(TableAlias.supervision.ID.eq(supervisionModel.getId()))
                    .execute();

            supervisorRepository.deleteSupervisionSupervisors(ctx, supervisionModel.getId());
            supervisionModel.getSupervisors().forEach(supervisorModel -> {
                supervisorRepository.insertSupervisionSupervisor(ctx, supervisionModel.getId(), supervisorModel.getId(), supervisorModel.getPriority(), supervisorModel.getUsername());
            });
        });
    }

    public void updateSupervision(Integer supervisionId, Boolean conformsToPermit) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.supervision)
                    .set(TableAlias.supervision.CONFORMS_TO_PERMIT, conformsToPermit)
                    .where(TableAlias.supervision.ID.eq(supervisionId))
                    .execute();
        });
    }

    public void deleteSupervision(SupervisionModel supervisionModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            supervisorRepository.deleteSupervisionSupervisors(ctx, supervisionModel.getId());
            supervisionStatusRepository.deleteSupervisionStatuses(ctx, supervisionModel.getId());

            ctx.delete(TableAlias.supervision)
                    .where(TableAlias.supervision.ID.eq(supervisionModel.getId()))
                    .execute();
        });
    }


}
