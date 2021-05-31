package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.RouteMapper;
import fi.vaylavirasto.sillari.model.RouteModel;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RouteRepository {
    @Autowired
    private DSLContext dsl;

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
}
