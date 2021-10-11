package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.SupervisorMapper;
import fi.vaylavirasto.sillari.model.SupervisorModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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
        return dsl.select().from(SupervisorMapper.supervisor)
                .fetch(new SupervisorMapper());
    }

    public List<SupervisorModel> getSupervisorsBySupervisionId(Integer supervisionId) {
        return dsl.select().from(SupervisorMapper.supervisor)
                .join(SupervisorMapper.supervisionSupervisor)
                .on(SupervisorMapper.supervisionSupervisor.SUPERVISOR_ID.eq(SupervisorMapper.supervisor.ID))
                .where(SupervisorMapper.supervisionSupervisor.SUPERVISION_ID.eq(supervisionId))
                .fetch(new SupervisorMapper());
    }

    public void insertSupervisionSupervisor(DSLContext ctx, Integer supervisionId, Integer supervisorId, Integer priority) {
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

    public void deleteSupervisionSupervisors(DSLContext ctx, Integer supervisionId) {
        ctx.deleteFrom(SupervisorMapper.supervisionSupervisor)
                .where(SupervisorMapper.supervisionSupervisor.SUPERVISION_ID.eq(supervisionId))
                .execute();
    }
}
