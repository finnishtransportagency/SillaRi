package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.RouteTransportCountMapper;
import fi.vaylavirasto.sillari.model.RouteTransportCountModel;
import fi.vaylavirasto.sillari.model.tables.records.RouteTransportCountRecord;
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
public class RouteTransportCountRepository {
    @Autowired
    private DSLContext dsl;

    private static final Logger logger = LogManager.getLogger();

    public List<RouteTransportCountModel> getRouteTransportCountList(Integer routeId) {
        return dsl.select().from(TableAlias.routeTransportCount)
                .where(TableAlias.routeTransportCount.ROUTE_ID.eq(routeId))
                .fetch(new RouteTransportCountMapper());
    }

    public Map<Integer, List<RouteTransportCountModel>> getRouteTransportCountsByRouteId(List<Integer> routeIds) {
        return dsl.selectFrom(TableAlias.routeTransportCount)
                .where(TableAlias.routeTransportCount.ROUTE_ID.in(routeIds))
                .orderBy(TableAlias.routeTransportCount.COUNT)
                .fetchGroups(RouteTransportCountRecord::getRouteId, new RouteTransportCountMapper());
    }

    public RouteTransportCountModel getNextAvailableRouteTransportCount(Integer routeId) {
        List<RouteTransportCountModel> count = dsl.select().from(TableAlias.routeTransportCount)
                .where(TableAlias.routeTransportCount.ROUTE_ID.eq(routeId))
                .and(TableAlias.routeTransportCount.USED.isFalse())
                .orderBy(TableAlias.routeTransportCount.COUNT)
                .limit(1)
                .fetch(new RouteTransportCountMapper());
        return count.size() > 0 ? count.get(0) : null;
    }

    public void updateRouteTransportCount(RouteTransportCountModel transportCount) throws DataAccessException {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.routeTransportCount)
                    .set(TableAlias.routeTransportCount.USED, transportCount.isUsed())
                    .set(TableAlias.routeTransportCount.ROUTE_TRANSPORT_ID, transportCount.getRouteTransportId())
                    .where(TableAlias.routeTransportCount.ID.eq(transportCount.getId()))
                    .execute();
        });
    }

}
