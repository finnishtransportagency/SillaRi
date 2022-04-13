package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.SupervisionSupervisorMapper;
import fi.vaylavirasto.sillari.model.SupervisorModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class SupervisorRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;


    public List<SupervisorModel> getSupervisors() {
        return dsl.select().from(TableAlias.supervisionSupervisor)
                .fetch(new SupervisionSupervisorMapper());
    }

    public List<SupervisorModel> getSupervisorsBySupervisionId(Integer supervisionId) {
        return dsl.select().from(TableAlias.supervisionSupervisor)
                .where(TableAlias.supervisionSupervisor.SUPERVISION_ID.eq(supervisionId))
                .fetch(record -> {
                    SupervisionSupervisorMapper supervisionSupervisorMapper = new SupervisionSupervisorMapper();
                    SupervisorModel supervisor = supervisionSupervisorMapper.map(record);
                    if (supervisor != null) {
                        // Supervisor created and updated timestamps overridden by supervisionSupervisor
                        supervisor.setRowCreatedTime(record.get(TableAlias.supervisionSupervisor.ROW_CREATED_TIME));
                        supervisor.setRowUpdatedTime(record.get(TableAlias.supervisionSupervisor.ROW_UPDATED_TIME));
                    }
                    return supervisor;
                });
    }

    public Map<Integer, List<SupervisorModel>> getSupervisorsBySupervisionId(List<Integer> supervisionId) {
        return dsl.select().from(TableAlias.supervisionSupervisor)
                .where(TableAlias.supervisionSupervisor.SUPERVISION_ID.in(supervisionId))
                .fetchGroups(TableAlias.supervisionSupervisor.SUPERVISION_ID, new SupervisionSupervisorMapper());
    }

    public List<SupervisorModel> getSupervisorsByRouteBridgeId(Integer routeBridgeId) {
        return dsl.select().from(TableAlias.supervisionSupervisor).where(TableAlias.supervisionSupervisor.SUPERVISION_ID.in(
                        dsl.select(TableAlias.supervision.ID).from(TableAlias.supervision).where(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(
                                routeBridgeId
                        ))
                ))
                .fetch(new SupervisionSupervisorMapper());
    }


    public List<SupervisorModel> getSupervisorsByRouteId(Integer routeId) {
        return dsl.select().from(TableAlias.supervisionSupervisor).where(TableAlias.supervisionSupervisor.SUPERVISION_ID.in(

                        dsl.select(TableAlias.supervision.ID).from(TableAlias.supervision).where(TableAlias.supervision.ROUTE_BRIDGE_ID.in(
                                dsl.select(TableAlias.routeBridge.ID).from(TableAlias.routeBridge).where(TableAlias.routeBridge.ROUTE_ID.eq(
                                        routeId
                                ))
                        ))

                ))
                .fetch(new SupervisionSupervisorMapper());
    }


    public List<SupervisorModel> getSupervisorsByRouteTransportId(Integer routeTransportId) {
        return dsl.select().from(TableAlias.supervisionSupervisor).where(TableAlias.supervisionSupervisor.SUPERVISION_ID.in(

                        dsl.select(TableAlias.supervision.ID).from(TableAlias.supervision).where(TableAlias.supervision.ROUTE_TRANSPORT_ID.eq(
                                routeTransportId
                        ))

                ))
                .fetch(new SupervisionSupervisorMapper());
    }


    public List<SupervisorModel> getSupervisorsByPermitId(Integer permitId) {
        return dsl.select().from(TableAlias.supervisionSupervisor).where(TableAlias.supervisionSupervisor.SUPERVISION_ID.in(

                        dsl.select(TableAlias.supervision.ID).from(TableAlias.supervision).where(TableAlias.supervision.ROUTE_BRIDGE_ID.in(
                                dsl.select(TableAlias.routeBridge.ID).from(TableAlias.routeBridge).where(TableAlias.routeBridge.ROUTE_ID.in(
                                        dsl.select(TableAlias.route.ID).from(TableAlias.route).where(TableAlias.route.PERMIT_ID.eq(
                                                permitId
                                        ))
                                ))
                        ))

                ))
                .fetch(new SupervisionSupervisorMapper());
    }


    public void insertSupervisionSupervisor(DSLContext ctx, Integer supervisionId, Integer priority, String username) {
        ctx.insertInto(TableAlias.supervisionSupervisor,
                        TableAlias.supervisionSupervisor.SUPERVISION_ID,
                        TableAlias.supervisionSupervisor.PRIORITY,
                        TableAlias.supervisionSupervisor.USERNAME
                ).values(
                        supervisionId,
                        priority,
                        username
                )
                .execute();
    }

    public void deleteSupervisionSupervisors(DSLContext ctx, Integer supervisionId) {
        ctx.deleteFrom(TableAlias.supervisionSupervisor)
                .where(TableAlias.supervisionSupervisor.SUPERVISION_ID.eq(supervisionId))
                .execute();
    }


    public SupervisorModel getSupervisorByUsername(DSLContext ctx, String username) {
        return ctx.select().from(TableAlias.supervisionSupervisor).where(TableAlias.supervisionSupervisor.USERNAME.eq(
                        username
                ))
                .fetchOne(new SupervisionSupervisorMapper());
    }


}
