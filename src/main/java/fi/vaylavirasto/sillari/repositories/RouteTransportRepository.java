package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.RouteTransportMapper;
import fi.vaylavirasto.sillari.mapper.SimpleRouteTransportMapper;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.TransportStatusType;
import fi.vaylavirasto.sillari.util.TableAlias;
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
        return dsl.select().from(TableAlias.routeTransport)
                .where(TableAlias.routeTransport.ID.eq(id))
                .fetchOne(new SimpleRouteTransportMapper());
    }

    public List<RouteTransportModel> getRouteTransportsByRouteId(Integer routeId) {
        return dsl.selectFrom(TableAlias.routeTransport)
                .where(TableAlias.routeTransport.ROUTE_ID.eq(routeId))
                .fetch(new SimpleRouteTransportMapper());
    }

    public List<RouteTransportModel> getRouteTransportsByPermitId(Integer permitId) {
        return dsl.select().from(TableAlias.routeTransport)
                .join(TableAlias.route)
                .on(TableAlias.route.ID.eq(TableAlias.routeTransport.ROUTE_ID))
                .join(TableAlias.permit)
                .on(TableAlias.permit.ID.eq(TableAlias.route.PERMIT_ID))
                .where(TableAlias.permit.ID.eq(permitId))
                .fetch(new SimpleRouteTransportMapper());
    }

    public List<RouteTransportModel> getRouteTransportsOfSupervisor(String username) {
        return dsl.select().from(TableAlias.routeTransport)
                .innerJoin(TableAlias.route).on(TableAlias.routeTransport.ROUTE_ID.eq(TableAlias.route.ID))
                .leftJoin(TableAlias.departureAddress).on(TableAlias.route.DEPARTURE_ADDRESS_ID.eq(TableAlias.departureAddress.ID))
                .leftJoin(TableAlias.arrivalAddress).on(TableAlias.route.ARRIVAL_ADDRESS_ID.eq(TableAlias.arrivalAddress.ID))
                .innerJoin(TableAlias.permit).on(TableAlias.route.PERMIT_ID.eq(TableAlias.permit.ID))
                .innerJoin(TableAlias.company).on(TableAlias.permit.COMPANY_ID.eq(TableAlias.company.ID))
                .innerJoin(TableAlias.supervision).on(TableAlias.routeTransport.ID.eq(TableAlias.supervision.ROUTE_TRANSPORT_ID))
                .innerJoin(TableAlias.supervisionSupervisor).on(TableAlias.supervision.ID.eq(TableAlias.supervisionSupervisor.SUPERVISION_ID))
                .where(TableAlias.supervisionSupervisor.USERNAME.eq(username))
                .fetch(new RouteTransportMapper());
    }

    public Integer createRouteTransport(RouteTransportModel routeTransportModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> routeTransportIdResult = ctx.insertInto(TableAlias.routeTransport,
                            TableAlias.routeTransport.ROUTE_ID,
                            TableAlias.routeTransport.PLANNED_DEPARTURE_TIME
                    ).values(
                            routeTransportModel.getRouteId(),
                            routeTransportModel.getPlannedDepartureTime()
                    )
                    .returningResult(TableAlias.routeTransport.ID)
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

            ctx.update(TableAlias.routeTransport)
                    .set(TableAlias.routeTransport.ROUTE_ID, routeTransportModel.getRouteId())
                    .set(TableAlias.routeTransport.PLANNED_DEPARTURE_TIME, routeTransportModel.getPlannedDepartureTime())
                    .where(TableAlias.routeTransport.ID.eq(routeTransportModel.getId()))
                    .execute();
        });
    }
}
