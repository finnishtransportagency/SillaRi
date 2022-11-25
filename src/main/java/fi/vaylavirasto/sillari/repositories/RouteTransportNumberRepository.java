package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.RouteTransportNumberViewMapper;
import fi.vaylavirasto.sillari.model.RouteTransportNumberModel;
import fi.vaylavirasto.sillari.model.tables.records.RouteTransportNumberViewRecord;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jooq.DSLContext;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class RouteTransportNumberRepository {
    @Autowired
    private DSLContext dsl;

    public Map<Long, List<RouteTransportNumberModel>> getRouteTransportNumbersByRouteLeluIds(List<Long> leluIds, String permitNumber) {
        return dsl.selectFrom(TableAlias.routeTransportNumberView)
                .where(TableAlias.routeTransportNumberView.ROUTE_LELU_ID.in(leluIds))
                .and(TableAlias.routeTransportNumberView.PERMIT_NUMBER.eq(permitNumber))
                .orderBy(TableAlias.routeTransportNumberView.PERMIT_LELU_VERSION, TableAlias.routeTransportNumberView.TRANSPORT_NUMBER)
                .fetchGroups(RouteTransportNumberViewRecord::getRouteLeluId, new RouteTransportNumberViewMapper());
    }

    public Map<Integer, List<RouteTransportNumberModel>> getRouteTransportNumbersByRouteLeluId(Long leluId, String permitNumber) {
        return dsl.selectFrom(TableAlias.routeTransportNumberView)
                .where(TableAlias.routeTransportNumberView.ROUTE_LELU_ID.eq(leluId))
                .and(TableAlias.routeTransportNumberView.PERMIT_NUMBER.eq(permitNumber))
                .orderBy(TableAlias.routeTransportNumberView.PERMIT_LELU_VERSION, TableAlias.routeTransportNumberView.TRANSPORT_NUMBER)
                .fetchGroups(RouteTransportNumberViewRecord::getRouteId, new RouteTransportNumberViewMapper());
    }

    public void updateRouteTransportNumber(Integer routeId, Integer routeTransportId, Integer transportNumber, Boolean used) throws DataAccessException {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.routeTransportNumber)
                    .set(TableAlias.routeTransportNumber.USED, used)
                    .set(TableAlias.routeTransportNumber.ROUTE_TRANSPORT_ID, routeTransportId)
                    .where(TableAlias.routeTransportNumber.ROUTE_ID.eq(routeId))
                    .and(TableAlias.routeTransportNumber.TRANSPORT_NUMBER.eq(transportNumber))
                    .execute();
        });
    }

}
