package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.AddressMapper;
import fi.vaylavirasto.sillari.mapper.RouteMapper;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.*;
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

    public List<RouteModel> getRoutesByPermitId(Integer permitId) {
        return dsl.select().from(TableAlias.route)
                .leftJoin(TableAlias.departureAddress).on(TableAlias.route.DEPARTURE_ADDRESS_ID.eq(TableAlias.departureAddress.ID))
                .leftJoin(TableAlias.arrivalAddress).on(TableAlias.route.ARRIVAL_ADDRESS_ID.eq(TableAlias.arrivalAddress.ID))
                .where(TableAlias.route.PERMIT_ID.eq(permitId))
                .fetch(this::mapRouteRecordWithAddresses);
    }

    public RouteModel getRoute(Integer id) {
        return dsl.select().from(TableAlias.route)
                .leftJoin(TableAlias.departureAddress).on(TableAlias.route.DEPARTURE_ADDRESS_ID.eq(TableAlias.departureAddress.ID))
                .leftJoin(TableAlias.arrivalAddress).on(TableAlias.route.ARRIVAL_ADDRESS_ID.eq(TableAlias.arrivalAddress.ID))
                .where(TableAlias.route.ID.eq(id))
                .fetchOne(this::mapRouteRecordWithAddresses);
    }

    private RouteModel mapRouteRecordWithAddresses(Record record) {
        RouteMapper routeMapper = new RouteMapper();
        RouteModel route = routeMapper.map(record);

        if (route != null) {
            AddressMapper departureAddressMapper = new AddressMapper(TableAlias.departureAddress);
            route.setDepartureAddress(departureAddressMapper.map(record));

            AddressMapper arrivalAddressMapper = new AddressMapper(TableAlias.arrivalAddress);
            route.setArrivalAddress(arrivalAddressMapper.map(record));
        }
        return route;
    }

    public String getRouteGeoJson(Integer id) {
        // In ST_AsGeoJSON(geom, 0, 2), the '0' means decimal places, the '2' means the option to include the short CRS (EPSG:3067)
        Field<String> geojsonField = DSL.field("ST_AsGeoJSON(geom, 0, 2)", String.class);
        return dsl.select(geojsonField).from(TableAlias.route)
                .where(TableAlias.route.ID.eq(id))
                .fetchOne(geojsonField);
    }

    public Map<Long, Integer> getRouteIdsWithLeluIds(Integer permitId) {
        Result<Record2<Long, Integer>> result = dsl.select(TableAlias.route.LELU_ID, TableAlias.route.ID)
                .from(TableAlias.route)
                .where(TableAlias.route.PERMIT_ID.eq(permitId))
                .orderBy(TableAlias.route.LELU_ID)
                .fetch();

        Map<Long, Integer> resultMap = result.intoMap(TableAlias.route.LELU_ID, TableAlias.route.ID);
        logger.debug("Route LeLu IDs with corresponding Route IDs resultMap={}", resultMap);
        return resultMap;
    }

    public List<RouteModel> getRoutesWithLeluId(Long id) {
        return dsl.select().from(TableAlias.route)
                .where(TableAlias.route.LELU_ID.eq(id))
                .fetch(new RouteMapper());
    }

}
