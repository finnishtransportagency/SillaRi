package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.RouteMapper;
import fi.vaylavirasto.sillari.model.RouteModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.Record2;
import org.jooq.Result;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class RouteRepository {
    @Autowired
    private DSLContext dsl;

    private static final Logger logger = LogManager.getLogger();

    public List<RouteModel> getRoutes(Integer permitId) {
        return dsl.select().from(RouteMapper.route)
                .leftJoin(RouteMapper.arrivalAddress).on(RouteMapper.route.ARRIVAL_ADDRESS_ID.eq(RouteMapper.arrivalAddress.ID))
                .leftJoin(RouteMapper.departureAddress).on(RouteMapper.route.DEPARTURE_ADDRESS_ID.eq(RouteMapper.departureAddress.ID))
                .where(RouteMapper.route.PERMIT_ID.eq(permitId))
                .fetch(new RouteMapper());
    }

    public RouteModel getRoute(Integer id) {
        return dsl.select().from(RouteMapper.route)
                .leftJoin(RouteMapper.arrivalAddress).on(RouteMapper.route.ARRIVAL_ADDRESS_ID.eq(RouteMapper.arrivalAddress.ID))
                .leftJoin(RouteMapper.departureAddress).on(RouteMapper.route.DEPARTURE_ADDRESS_ID.eq(RouteMapper.departureAddress.ID))
                .where(RouteMapper.route.ID.eq(id))
                .fetchOne(new RouteMapper());
    }

    public String getRouteGeoJson(Integer id) {
        // In ST_AsGeoJSON(geom, 0, 2), the '0' means decimal places, the '2' means the option to include the short CRS (EPSG:3067)
        Field<String> geojsonField = DSL.field("ST_AsGeoJSON(geom, 0, 2)", String.class);
        return dsl.select(geojsonField).from(RouteMapper.route)
                .where(RouteMapper.route.ID.eq(id))
                .fetchOne(geojsonField);
    }

    public Map<Long, Integer> getRouteIdsWithLeluIds(Integer permitId) {
        Result<Record2<Long, Integer>> result = dsl.select(RouteMapper.route.LELU_ID, RouteMapper.route.ID)
                .from(RouteMapper.route)
                .where(RouteMapper.route.PERMIT_ID.eq(permitId))
                .orderBy(RouteMapper.route.LELU_ID)
                .fetch();

        Map<Long, Integer> resultMap = result.intoMap(RouteMapper.route.LELU_ID, RouteMapper.route.ID);
        logger.debug("Route LeLu IDs with corresponding Route IDs resultMap={}", resultMap);
        return resultMap;
    }

}
