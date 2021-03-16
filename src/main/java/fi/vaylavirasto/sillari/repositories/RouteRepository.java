package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.AuthorizationMapper;
import fi.vaylavirasto.sillari.model.RouteMapper;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.TransportMapper;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RouteRepository {
    @Autowired
    private DSLContext dsl;

    public List<RouteModel> getRoutes(Integer authorizationId) {
        return dsl.select().from(RouteMapper.route)
                .leftJoin(RouteMapper.arrivalAddress).on(RouteMapper.route.ARRIVAL_ADDRESS_ID.eq(TransportMapper.arrivalAddress.ID))
                .leftJoin(RouteMapper.departureAddress).on(RouteMapper.route.DEPARTURE_ADDRESS_ID.eq(TransportMapper.departureAddress.ID))
                .where(RouteMapper.route.AUTHORIZATION_ID.eq(authorizationId))
                .fetch(new RouteMapper());
    }
}
