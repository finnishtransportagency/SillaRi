package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.RouteTransportMapper;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RouteTransportRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public RouteTransportModel getRouteTransportById(int id) {
        return dsl.selectFrom(RouteTransportMapper.transport)
                .where(RouteTransportMapper.transport.ID.eq(id))
                .fetchOne(new RouteTransportMapper());
    }

    public RouteTransportModel getRouteTransportByRouteId(int routeId) {
        return dsl.selectFrom(RouteTransportMapper.transport)
                .where(RouteTransportMapper.transport.ROUTE_ID.eq(routeId))
                .fetchOne(new RouteTransportMapper());
    }
}
