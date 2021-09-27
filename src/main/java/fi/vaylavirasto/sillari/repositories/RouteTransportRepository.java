package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.PermitMapper;
import fi.vaylavirasto.sillari.model.RouteMapper;
import fi.vaylavirasto.sillari.model.RouteTransportMapper;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.RouteTransportStatusMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RouteTransportRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public RouteTransportModel getRouteTransportById(Integer id) {
        return dsl.select().from(RouteTransportMapper.transport)
                .leftJoin(RouteTransportStatusMapper.transportStatus)
                .on(RouteTransportMapper.transport.ID.eq(RouteTransportStatusMapper.transportStatus.ROUTE_TRANSPORT_ID))
                .where(RouteTransportMapper.transport.ID.eq(id))
                .orderBy(RouteTransportStatusMapper.transportStatus.TIME.desc())
                .limit(1).fetchOne(new RouteTransportMapper());
    }

    public RouteTransportModel getRouteTransportByRouteId(Integer routeId) {
        // TODO route can have multiple transport instances, how do we specify this instance?
        return dsl.select().from(RouteTransportMapper.transport)
                .leftJoin(RouteTransportStatusMapper.transportStatus)
                .on(RouteTransportMapper.transport.ID.eq(RouteTransportStatusMapper.transportStatus.ROUTE_TRANSPORT_ID))
                .where(RouteTransportMapper.transport.ROUTE_ID.eq(routeId))
                .orderBy(RouteTransportStatusMapper.transportStatus.TIME.desc())
                .limit(1).fetchOne(new RouteTransportMapper());
    }

    public List<RouteTransportModel> getRouteTransportsByPermitId(Integer permitId) {
        return dsl.select().from(RouteTransportMapper.transport)
                .join(RouteMapper.route)
                .on(RouteMapper.route.ID.eq(RouteTransportMapper.transport.ROUTE_ID))
                .join(PermitMapper.permit)
                .on(PermitMapper.permit.ID.eq(RouteMapper.route.PERMIT_ID))
                .leftJoin(RouteTransportStatusMapper.transportStatus)
                .on(RouteTransportMapper.transport.ID.eq(RouteTransportStatusMapper.transportStatus.ROUTE_TRANSPORT_ID))
                .where(PermitMapper.permit.ID.eq(permitId))
                .fetch(new RouteTransportMapper());
    }
}
