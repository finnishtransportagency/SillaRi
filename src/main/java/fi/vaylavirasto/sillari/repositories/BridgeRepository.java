package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.*;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BridgeRepository {
    @Autowired
    private DSLContext dsl;
    public BridgeModel getBridge(Integer id) {
        BridgeModel model = dsl.select().from(BridgeMapper.bridge)
                .where(BridgeMapper.bridge.ID.eq(id))
                .fetchOne(new BridgeMapper());
        return model;
    }
    public List<BridgeModel> getRoutesBridges(Integer routeId) {
        List<BridgeModel> bridgeModels = dsl.select().from(RouteBridgeMapper.routebridge)
                .leftJoin(RouteBridgeMapper.bridge).on(RouteBridgeMapper.bridge.ID.eq(RouteBridgeMapper.routebridge.BRIDGE_ID))
                .where(RouteBridgeMapper.routebridge.ROUTE_ID.eq(routeId))
                .fetch(new RouteBridgeMapper());
        return bridgeModels;
    }
}
