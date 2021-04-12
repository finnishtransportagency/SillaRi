package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.RouteBridgeMapper;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RouteBridgeRepository {
    @Autowired
    private DSLContext dsl;

    public BridgeModel getRouteBridge(Integer routeId, Integer bridgeId) {
        Condition routeIdEq = RouteBridgeMapper.routebridge.ROUTE_ID.eq(routeId);
        Condition bridgeIdEq = RouteBridgeMapper.routebridge.BRIDGE_ID.eq(bridgeId);

        return dsl.select().from(RouteBridgeMapper.routebridge)
                .leftJoin(RouteBridgeMapper.bridge).on(RouteBridgeMapper.bridge.ID.eq(RouteBridgeMapper.routebridge.BRIDGE_ID))
                .where(routeIdEq.and(bridgeIdEq))
                .fetchOne(new RouteBridgeMapper());
    }

}
