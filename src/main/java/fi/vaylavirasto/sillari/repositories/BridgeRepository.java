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
        List<BridgeModel> bridgeModels = dsl.select().from(RoutesBridgesMapper.routesbridges)
                .leftJoin(RoutesBridgesMapper.bridge).on(RoutesBridgesMapper.bridge.ID.eq(RoutesBridgesMapper.routesbridges.BRIDGEID))
                .where(RoutesBridgesMapper.routesbridges.ROUTEID.eq(routeId))
                .fetch(new RoutesBridgesMapper());
        return bridgeModels;
    }
}
