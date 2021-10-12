package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.RouteTransportMapper;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.TransportStatusType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RouteTransportRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;
    @Autowired
    RouteTransportStatusRepository routeTransportStatusRepository;

    public RouteTransportModel getRouteTransportById(Integer id) {
        return dsl.select().from(RouteTransportMapper.transport)
                .where(RouteTransportMapper.transport.ID.eq(id))
                .fetchOne(new RouteTransportMapper());
    }

    public RouteTransportModel getRouteTransportByRouteId(Integer routeId) {
        // TODO route can have multiple transport instances, how do we specify this instance?
        return dsl.select().from(RouteTransportMapper.transport)
                .where(RouteTransportMapper.transport.ROUTE_ID.eq(routeId))
                .fetchOne(new RouteTransportMapper());
    }

    public List<RouteTransportModel> getRouteTransportsByPermitId(Integer permitId) {
        return dsl.select().from(RouteTransportMapper.transport)
                .join(RouteTransportMapper.route)
                .on(RouteTransportMapper.route.ID.eq(RouteTransportMapper.transport.ROUTE_ID))
                .join(RouteTransportMapper.permit)
                .on(RouteTransportMapper.permit.ID.eq(RouteTransportMapper.route.PERMIT_ID))
                .where(RouteTransportMapper.permit.ID.eq(permitId))
                .fetch(new RouteTransportMapper());
    }

    public Integer createRouteTransport(RouteTransportModel routeTransportModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> routeTransportIdResult = ctx.insertInto(RouteTransportMapper.transport,
                            RouteTransportMapper.transport.ROUTE_ID,
                            RouteTransportMapper.transport.PLANNED_DEPARTURE_TIME
                    ).values(
                            routeTransportModel.getRouteId(),
                            routeTransportModel.getPlannedDepartureTime()
                    )
                    .returningResult(RouteTransportMapper.transport.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer routeTransportId = routeTransportIdResult != null ? routeTransportIdResult.value1() : null;
            routeTransportModel.setId(routeTransportId);

            routeTransportStatusRepository.insertTransportStatus(ctx, routeTransportId, TransportStatusType.PLANNED);

            return routeTransportId;
        });
    }

    public void updateRouteTransport(RouteTransportModel routeTransportModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(RouteTransportMapper.transport)
                    .set(RouteTransportMapper.transport.ROUTE_ID, routeTransportModel.getRouteId())
                    .set(RouteTransportMapper.transport.PLANNED_DEPARTURE_TIME, routeTransportModel.getPlannedDepartureTime())
                    .where(RouteTransportMapper.transport.ID.eq(routeTransportModel.getId()))
                    .execute();
        });
    }
}
