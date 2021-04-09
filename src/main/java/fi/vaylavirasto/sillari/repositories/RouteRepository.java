package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.RouteMapper;
import fi.vaylavirasto.sillari.model.RouteModel;
import org.jooq.DSLContext;
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
        RouteModel model = dsl.select().from(RouteMapper.route)
                .leftJoin(RouteMapper.arrivalAddress).on(RouteMapper.route.ARRIVAL_ADDRESS_ID.eq(RouteMapper.arrivalAddress.ID))
                .leftJoin(RouteMapper.departureAddress).on(RouteMapper.route.DEPARTURE_ADDRESS_ID.eq(RouteMapper.departureAddress.ID))
                .where(RouteMapper.route.ID.eq(id))
                .fetchOne(new RouteMapper());

        return model;
    }
}
