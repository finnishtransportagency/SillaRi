package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.BridgeMapper;
import fi.vaylavirasto.sillari.mapper.RouteBridgeMapper;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RouteBridgeRepository {
    @Autowired
    private DSLContext dsl;

    public RouteBridgeModel getRouteBridge(Integer id) {
        return dsl.select().from(TableAlias.routeBridge)
                .leftJoin(TableAlias.bridge).on(TableAlias.bridge.ID.eq(TableAlias.routeBridge.BRIDGE_ID))
                .where(TableAlias.routeBridge.ID.eq(id))
                .fetchOne(this::mapRouteBridgeRecordWithBridge);
    }

    public List<RouteBridgeModel> getRouteBridges(Integer routeId) {
        return dsl.select().from(TableAlias.routeBridge)
                .leftJoin(TableAlias.bridge).on(TableAlias.bridge.ID.eq(TableAlias.routeBridge.BRIDGE_ID))
                .where(TableAlias.routeBridge.ROUTE_ID.eq(routeId))
                .fetch(this::mapRouteBridgeRecordWithBridge);
    }

    private RouteBridgeModel mapRouteBridgeRecordWithBridge(Record record) {
        RouteBridgeMapper routeBridgeMapper = new RouteBridgeMapper();
        RouteBridgeModel routeBridge = routeBridgeMapper.map(record);
        if (routeBridge != null) {
            BridgeMapper bridgeMapper = new BridgeMapper();
            routeBridge.setBridge(bridgeMapper.map(record));
        }
        return routeBridge;
    }

    public List<RouteBridgeModel> getWholeRouteBridges(Integer routeId) {
        return dsl.select().from(RouteBridgeMapper.routebridge)
                .leftJoin(RouteBridgeMapper.bridge).on(RouteBridgeMapper.bridge.ID.eq(RouteBridgeMapper.routebridge.BRIDGE_ID))
                .leftJoin(RouteBridgeMapper.supervision).on(RouteBridgeMapper.supervision.ROUTE_BRIDGE_ID.eq(RouteBridgeMapper.routebridge.ID))
                .where(RouteBridgeMapper.routebridge.ROUTE_ID.eq(routeId))
                .fetch(new RouteBridgeMapper());
    }

}
