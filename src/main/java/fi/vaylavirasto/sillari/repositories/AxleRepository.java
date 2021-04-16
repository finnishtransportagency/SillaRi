package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.AxleMapper;
import fi.vaylavirasto.sillari.model.AxleModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AxleRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public AxleModel getAxleById(int id) {
        return dsl.selectFrom(AxleMapper.axle)
                .where(AxleMapper.axle.ID.eq(id))
                .fetchOne(new AxleMapper());
    }

    public List<AxleModel> getAxlesOfTransport(Integer transportId) {
        return dsl.select().from(AxleMapper.axle)
                .where(AxleMapper.axle.TRANSPORT_ID.eq(transportId))
                .fetch(new AxleMapper());
    }
}
