package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.Tables;
import fi.vaylavirasto.sillari.model.tables.Bridge;
import fi.vaylavirasto.sillari.model.tables.Route;
import fi.vaylavirasto.sillari.model.tables.RouteBridge;
import fi.vaylavirasto.sillari.model.tables.Supervision;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteBridgeMapper implements RecordMapper<Record, RouteBridgeModel> {
    public static final Bridge bridge = Tables.BRIDGE.as("br");
    public static final Route route = Tables.ROUTE.as("ro");
    public static final RouteBridge routebridge = Tables.ROUTE_BRIDGE.as("rbr");
    public static final Supervision supervision = Tables.SUPERVISION.as("sn");

    @Nullable
    @Override
    public RouteBridgeModel map(Record record) {
        BridgeMapper bridgeMapper = new BridgeMapper();
        BridgeModel bridgeModel = bridgeMapper.map(record);

        RouteBridgeModel model = new RouteBridgeModel();
        model.setId(record.get(routebridge.ID));
        model.setRouteId(record.get(routebridge.ROUTE_ID));
        model.setBridgeId(record.get(routebridge.BRIDGE_ID));
        model.setCrossingInstruction(record.get(routebridge.CROSSING_INSTRUCTION));
        model.setBridge(bridgeModel);

        return model;
    }
}
