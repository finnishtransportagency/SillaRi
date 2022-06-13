package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.RouteTransportNumberMapper;
import fi.vaylavirasto.sillari.model.RouteTransportNumberModel;
import fi.vaylavirasto.sillari.model.tables.records.RouteTransportNumberRecord;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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

    private static final Logger logger = LogManager.getLogger();

    public List<RouteTransportNumberModel> getRouteTransportNumberList(Integer routeId) {
        return dsl.select().from(TableAlias.routeTransportNumber)
                .where(TableAlias.routeTransportNumber.ROUTE_ID.eq(routeId))
                .fetch(new RouteTransportNumberMapper());
    }

    public Map<Integer, List<RouteTransportNumberModel>> getRouteTransportNumbersByRouteId(List<Integer> routeIds) {
        return dsl.selectFrom(TableAlias.routeTransportNumber)
                .where(TableAlias.routeTransportNumber.ROUTE_ID.in(routeIds))
                .orderBy(TableAlias.routeTransportNumber.TRANSPORT_NUMBER)
                .fetchGroups(RouteTransportNumberRecord::getRouteId, new RouteTransportNumberMapper());
    }

    public RouteTransportNumberModel getNextAvailableRouteTransportNumber(Integer routeId) {
        List<RouteTransportNumberModel> count = dsl.select().from(TableAlias.routeTransportNumber)
                .where(TableAlias.routeTransportNumber.ROUTE_ID.eq(routeId))
                .and(TableAlias.routeTransportNumber.USED.isFalse())
                .orderBy(TableAlias.routeTransportNumber.TRANSPORT_NUMBER)
                .limit(1)
                .fetch(new RouteTransportNumberMapper());
        return count.size() > 0 ? count.get(0) : null;
    }

    public void updateRouteTransportNumber(RouteTransportNumberModel transportNumber) throws DataAccessException {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.routeTransportNumber)
                    .set(TableAlias.routeTransportNumber.USED, transportNumber.isUsed())
                    .set(TableAlias.routeTransportNumber.ROUTE_TRANSPORT_ID, transportNumber.getRouteTransportId())
                    .where(TableAlias.routeTransportNumber.ID.eq(transportNumber.getId()))
                    .execute();
        });
    }

}
