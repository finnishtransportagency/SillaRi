package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.RouteBridgeMapper;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RouteBridgeRepository {
    @Autowired
    private DSLContext dsl;

    public RouteBridgeModel getRouteBridge(Integer id) {
        return dsl.select().from(RouteBridgeMapper.routebridge)
                .leftJoin(RouteBridgeMapper.bridge).on(RouteBridgeMapper.bridge.ID.eq(RouteBridgeMapper.routebridge.BRIDGE_ID))
                .leftJoin(RouteBridgeMapper.supervision).on(RouteBridgeMapper.routebridge.ID.eq(RouteBridgeMapper.supervision.ROUTE_BRIDGE_ID))
                .where(RouteBridgeMapper.routebridge.ID.eq(id))
                .fetchOne(new RouteBridgeMapper());
    }

    public List<RouteBridgeModel> getRouteBridges(Integer routeId) {
        return dsl.select().from(RouteBridgeMapper.routebridge)
                .leftJoin(RouteBridgeMapper.bridge).on(RouteBridgeMapper.bridge.ID.eq(RouteBridgeMapper.routebridge.BRIDGE_ID))
                .leftJoin(RouteBridgeMapper.supervision).on(RouteBridgeMapper.routebridge.ID.eq(RouteBridgeMapper.supervision.ROUTE_BRIDGE_ID))
                .where(RouteBridgeMapper.routebridge.ROUTE_ID.eq(routeId))
                .fetch(new RouteBridgeMapper());
    }

    public List<RouteBridgeModel> getSupervisorRouteBridges(Integer supervisorId) {
        return dsl.select().from(RouteBridgeMapper.routebridge)
                .leftJoin(RouteBridgeMapper.bridge).on(RouteBridgeMapper.bridge.ID.eq(RouteBridgeMapper.routebridge.BRIDGE_ID))
                .leftJoin(RouteBridgeMapper.supervision).on(RouteBridgeMapper.routebridge.ID.eq(RouteBridgeMapper.supervision.ROUTE_BRIDGE_ID))
                .leftJoin(RouteBridgeMapper.supervisionSupervisor).on(RouteBridgeMapper.supervision.ID.eq(RouteBridgeMapper.supervisionSupervisor.SUPERVISION_ID))
                .where(RouteBridgeMapper.supervisionSupervisor.SUPERVISOR_ID.eq(supervisorId))
                .orderBy(RouteBridgeMapper.supervision.PLANNED_TIME)
                .fetch(new RouteBridgeMapper());
    }

}
