package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.SupervisionMapper;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SupervisionRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public SupervisionModel getSupervisionById(Integer id) {
        return dsl.selectFrom(SupervisionMapper.supervision)
                .where(SupervisionMapper.supervision.ID.eq(id))
                .fetchOne(new SupervisionMapper());
    }

    public SupervisionModel getSupervisionByRouteBridgeId(Integer routeBridgeId) {
        SupervisionModel model =  dsl.selectFrom(SupervisionMapper.supervision)
                .where(SupervisionMapper.supervision.ROUTE_BRIDGE_ID.eq(routeBridgeId))
                .fetchOne(new SupervisionMapper());
        logger.info("Supervision: " + model);
        return model;
    }

    public List<SupervisionModel> getRouteTransportSupervisions(Integer routeTransportId) {
        return dsl.selectFrom(SupervisionMapper.supervision)
                .where(SupervisionMapper.supervision.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .fetch(new SupervisionMapper());
    }

}
