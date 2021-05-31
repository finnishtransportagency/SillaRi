package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.RouteTransportStatusMapper;
import fi.vaylavirasto.sillari.model.RouteTransportStatusModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RouteTransportStatusRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public List<RouteTransportStatusModel> getTransportStatusHistory(Integer routeTransportId) {
        List<RouteTransportStatusModel> models = dsl.selectFrom(RouteTransportStatusMapper.transportStatus)
                .where(RouteTransportStatusMapper.transportStatus.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .orderBy(RouteTransportStatusMapper.transportStatus.TIME.desc())
                .fetch(new RouteTransportStatusMapper());
        logger.info(models);
        return models;
    }

}
