package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.SupervisorMapper;
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
}
