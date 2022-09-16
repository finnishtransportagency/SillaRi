package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.BridgeMapper;
import fi.vaylavirasto.sillari.mapper.RouteBridgeMapper;
import fi.vaylavirasto.sillari.mapper.SupervisionMapper;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static org.jooq.impl.DSL.*;

@Repository
public class SupervisionRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;

    public SupervisionModel getSupervisionById(Integer id) {
        return dsl.select().from(TableAlias.supervision)
                .leftJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .leftJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .where(TableAlias.supervision.ID.eq(id))
                .fetchOne(this::mapSupervisionWithRouteBridgeAndBridge);
    }

    public List<SupervisionModel> getSupervisionsByRouteTransportId(Integer routeTransportId) {
        return dsl.select().from(TableAlias.supervision)
                .innerJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .innerJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .where(TableAlias.supervision.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .fetch(this::mapSupervisionWithRouteBridgeAndBridge);
    }

    public List<SupervisionModel> getSupervisionsByRouteTransportId(List<Integer> routeTransportIds) {
        return dsl.select().from(TableAlias.supervision)
                .innerJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .innerJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .where(TableAlias.supervision.ROUTE_TRANSPORT_ID.in(routeTransportIds))
                .fetch(this::mapSupervisionWithRouteBridgeAndBridge);
    }

    public List<SupervisionModel> getSupervisionsByRouteBridgeId(Integer routeBridgeId) {
        return dsl.select().from(TableAlias.supervision)
                .where(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(routeBridgeId))
                .orderBy(TableAlias.supervision.ROW_CREATED_TIME)
                .fetch(new SupervisionMapper());
    }


    public List<SupervisionModel> getSupervisionsBySupervisor(String businessId) {
        return dsl.select().from(TableAlias.supervision)
                .innerJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .innerJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .where(TableAlias.supervision.SUPERVISOR_COMPANY.eq(businessId))
                .and(supervisionNotCompleted())
                // Order by planned time takes also seconds and milliseconds into account, when we want to sort by route transport and ordinal
                // when planned time is the same in MINUTES. Sort in UI instead.
                //.orderBy(TableAlias.supervision.PLANNED_TIME, TableAlias.supervision.ROUTE_TRANSPORT_ID, TableAlias.routeBridge.ORDINAL)
                .fetch(this::mapSupervisionWithRouteBridgeAndBridge);
    }

    public SupervisionModel getSupervisionBySupervisionImageId(Integer imageId) {
        return dsl.select().from(TableAlias.supervision).where(TableAlias.supervision.ID.eq(
                        dsl.select(TableAlias.supervisionImage.SUPERVISION_ID).from(TableAlias.supervisionImage).where(TableAlias.supervisionImage.ID.eq(
                                imageId
                        ))
                ))
                .fetchOne(new SupervisionMapper());
    }

    public List<SupervisionModel> getSupervisionsByRouteTransportAndSupervisor(Integer routeTransportId, String businessId) {
        return dsl.select().from(TableAlias.supervision)
                .innerJoin(TableAlias.routeTransport).on(TableAlias.supervision.ROUTE_TRANSPORT_ID.eq(TableAlias.routeTransport.ID))
                .innerJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .innerJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .where(TableAlias.supervision.SUPERVISOR_COMPANY.eq(businessId))
                .and(TableAlias.routeTransport.ID.eq(routeTransportId))
                .and(supervisionNotCompleted())
                .orderBy(TableAlias.routeBridge.ORDINAL)
                .fetch(this::mapSupervisionWithRouteBridgeAndBridge);
    }

    private Condition supervisionNotCompleted() {
        return notExists(selectOne().from(TableAlias.supervisionStatus
                .where(TableAlias.supervisionStatus.SUPERVISION_ID.eq(TableAlias.supervision.ID)
                        .and((TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.FINISHED.toString()))
                                .or(TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.CROSSING_DENIED.toString()))
                                .or(TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.REPORT_SIGNED.toString()))))));
    }

    public List<SupervisionModel> getFinishedSupervisionsBySupervisor(String businessId) {
        return dsl.select().from(TableAlias.supervision)
                .innerJoin(TableAlias.routeTransport).on(TableAlias.supervision.ROUTE_TRANSPORT_ID.eq(TableAlias.routeTransport.ID))
                .innerJoin(TableAlias.routeBridge).on(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))
                .innerJoin(TableAlias.bridge).on(TableAlias.routeBridge.BRIDGE_ID.eq(TableAlias.bridge.ID))
                .where(TableAlias.supervision.SUPERVISOR_COMPANY.eq(businessId))
                .and(exists(selectOne()
                        .from(TableAlias.supervisionStatus)
                        .where(TableAlias.supervisionStatus.SUPERVISION_ID.eq(TableAlias.supervision.ID)
                                .and(TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.FINISHED.toString())))))
                .fetch(this::mapSupervisionWithRouteBridgeAndBridge);
    }

    public List<SupervisionModel> getFinishedButUnsignedSupervisionsBySupervisor(String businessId) {
        return dsl.select().from(TableAlias.supervision)
                .where(TableAlias.supervision.SUPERVISOR_COMPANY.eq(businessId))
                .and(exists(selectOne()
                        .from(TableAlias.supervisionStatus)
                        .where(TableAlias.supervisionStatus.SUPERVISION_ID.eq(TableAlias.supervision.ID)
                                .and(TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.FINISHED.toString())))))
                .and(notExists(selectOne()
                        .from(TableAlias.supervisionStatus)
                        .where(TableAlias.supervisionStatus.SUPERVISION_ID.eq(TableAlias.supervision.ID)
                                .and(TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.REPORT_SIGNED.toString())))))
                .fetch(new SupervisionMapper());
    }

    public List<SupervisionModel> getUnsignedSupervisionsBySupervisor(String businessId) {
        return dsl.select().from(TableAlias.supervision)
                .where(TableAlias.supervision.SUPERVISOR_COMPANY.eq(businessId))
                .and(notExists(selectOne()
                        .from(TableAlias.supervisionStatus)
                        .where(TableAlias.supervisionStatus.SUPERVISION_ID.eq(TableAlias.supervision.ID)
                                .and(TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.REPORT_SIGNED.toString())))))
                .fetch(new SupervisionMapper());
    }

    public List<SupervisionModel> getAllSupervisionsOfSupervisor(String businessId) {
        return dsl.select().from(TableAlias.supervision)
                .where(TableAlias.supervision.SUPERVISOR_COMPANY.eq(businessId))
                .fetch(new SupervisionMapper());
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
                            TableAlias.supervision.SUPERVISOR_COMPANY,
                            TableAlias.supervision.SUPERVISOR_TYPE,
                            TableAlias.supervision.CONFORMS_TO_PERMIT
                    ).values(
                    supervisionModel.getRouteBridgeId(),
                    supervisionModel.getRouteTransportId(),
                    supervisionModel.getPlannedTime(),
                    supervisionModel.getSupervisorCompany(),
                    supervisionModel.getSupervisorType().toString(),
                    false)
                    .returningResult(TableAlias.supervision.ID)
                    .fetchOne(); // Execute and return zero or one record

            return supervisionIdResult != null ? supervisionIdResult.value1() : null;
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

            supervisionStatusRepository.deleteSupervisionStatuses(ctx, supervisionModel.getId());

            ctx.delete(TableAlias.supervision)
                    .where(TableAlias.supervision.ID.eq(supervisionModel.getId()))
                    .execute();
        });
    }

    public List<String> getSupervisorsByRouteTransportId(Integer routeTransportId) {
        return dsl.select(TableAlias.supervision.SUPERVISOR_COMPANY).from(TableAlias.supervision)
                .where(TableAlias.supervision.ROUTE_TRANSPORT_ID.eq(routeTransportId)).fetch(TableAlias.supervision.SUPERVISOR_COMPANY);
    }

    public List<String> getSupervisorsByRouteBridgeId(Integer routeBridgeId) {
        return dsl.select(TableAlias.supervision.SUPERVISOR_COMPANY).from(TableAlias.supervision)
                .where(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(routeBridgeId)).fetch(TableAlias.supervision.SUPERVISOR_COMPANY);
    }

    public List<String> getSupervisorsByRouteId(Integer routeId) {
        return dsl.select(TableAlias.supervision.SUPERVISOR_COMPANY).from(TableAlias.supervision)
                .where(TableAlias.supervision.ROUTE_BRIDGE_ID.in(
                        dsl.select(TableAlias.routeBridge.ID).from(TableAlias.routeBridge)
                                .where(TableAlias.routeBridge.ROUTE_ID.eq(routeId))))
                .fetch(TableAlias.supervision.SUPERVISOR_COMPANY);
    }

    public List<String> getSupervisorsByPermitId(Integer permitId) {
        return dsl.select(TableAlias.supervision.SUPERVISOR_COMPANY).from(TableAlias.supervision)
                .where(TableAlias.supervision.ROUTE_BRIDGE_ID.in(
                        dsl.select(TableAlias.routeBridge.ID).from(TableAlias.routeBridge).where(TableAlias.routeBridge.ROUTE_ID.in(
                                dsl.select(TableAlias.route.ID).from(TableAlias.route).where(TableAlias.route.PERMIT_ID.eq(permitId)))
                        ))
                ).fetch(TableAlias.supervision.SUPERVISOR_COMPANY);
    }

    public List<SupervisionModel> getSupervisionsOfAreaContractor(String businessId) {
        return dsl.select().from(TableAlias.supervision)
                .where(TableAlias.supervision.SUPERVISOR_COMPANY.eq(businessId))
                .and(supervisionNotCompleted()
                .and(TableAlias.supervision.ROUTE_BRIDGE_ID.in(
                        dsl.select(TableAlias.routeBridge.ID).from(TableAlias.routeBridge).where(TableAlias.routeBridge.ROUTE_ID.in(
                                dsl.select(TableAlias.route.ID).from(TableAlias.route).where(TableAlias.route.PERMIT_ID.in(
                                        dsl.select(TableAlias.permit.ID).from(TableAlias.permit).where(TableAlias.permit.CUSTOMER_USES_SILLARI.isNull().or(TableAlias.permit.CUSTOMER_USES_SILLARI.eq(false))))
                                )))
                        )))
                .fetch(new SupervisionMapper());
    }
}
