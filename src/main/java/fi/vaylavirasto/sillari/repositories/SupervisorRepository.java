package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.SupervisorMapper;
import fi.vaylavirasto.sillari.model.SupervisorModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jetbrains.annotations.NotNull;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SupervisorRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public List<SupervisorModel> getSupervisors() {
        return dsl.select().from(TableAlias.supervisor)
                .fetch(new SupervisorMapper());
    }

    public List<SupervisorModel> getSupervisorsBySupervisionId(Integer supervisionId) {
        return dsl.select().from(TableAlias.supervisor)
                .innerJoin(TableAlias.supervisionSupervisor)
                .on(TableAlias.supervisionSupervisor.SUPERVISOR_ID.eq(TableAlias.supervisor.ID))
                .where(TableAlias.supervisionSupervisor.SUPERVISION_ID.eq(supervisionId))
                .fetch(record -> {
                    SupervisorMapper supervisorMapper = new SupervisorMapper();
                    SupervisorModel supervisor = supervisorMapper.map(record);
                    if (supervisor != null) {
                        supervisor.setPriority(record.get(TableAlias.supervisionSupervisor.PRIORITY));
                        // Supervisor created and updated timestamps overridden by supervisionSupervisor
                        supervisor.setRowCreatedTime(record.get(TableAlias.supervisionSupervisor.ROW_CREATED_TIME));
                        supervisor.setRowUpdatedTime(record.get(TableAlias.supervisionSupervisor.ROW_UPDATED_TIME));
                    }
                    return supervisor;
                });
    }

    public  List<SupervisorModel> getSupervisorsByRouteBridgeId(Integer routeBridgeId) {
        return
                dsl.select().from(TableAlias.supervisor).where(TableAlias.supervisor.ID.in(
                                dsl.select(TableAlias.supervisionSupervisor.SUPERVISOR_ID).from(TableAlias.supervisionSupervisor).where(TableAlias.supervisionSupervisor.SUPERVISION_ID.in(
                                        dsl.select(TableAlias.supervision.ID).from(TableAlias.supervision).where(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(
                                                routeBridgeId
                                        ))
                                ))
                        ))
                        .fetch(new SupervisorMapper());
    }


    public void insertSupervisionSupervisor(DSLContext ctx, Integer supervisionId, Integer supervisorId, Integer priority, String username) {
        ctx.insertInto(TableAlias.supervisionSupervisor,
                        TableAlias.supervisionSupervisor.SUPERVISION_ID,
                        TableAlias.supervisionSupervisor.SUPERVISOR_ID,
                        TableAlias.supervisionSupervisor.PRIORITY,
                        TableAlias.supervisionSupervisor.USERNAME
                ).values(
                        supervisionId,
                        supervisorId,
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
}
