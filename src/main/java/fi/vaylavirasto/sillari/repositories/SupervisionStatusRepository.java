package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.SupervisionStatusMapper;
import fi.vaylavirasto.sillari.model.SupervisionStatusModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SupervisionStatusRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public List<SupervisionStatusModel> getSupervisionStatusHistory(Integer supervisionId) {
        return dsl.selectFrom(SupervisionStatusMapper.supervisionStatus)
                .where(SupervisionStatusMapper.supervisionStatus.SUPERVISION_ID.eq(supervisionId))
                .orderBy(SupervisionStatusMapper.supervisionStatus.TIME.desc())
                .fetch(new SupervisionStatusMapper());
    }

}
