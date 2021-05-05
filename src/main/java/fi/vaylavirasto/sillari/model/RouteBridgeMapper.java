package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Bridge;
import fi.vaylavirasto.sillari.model.tables.RouteBridge;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteBridgeMapper implements RecordMapper<Record,RouteBridgeModel> {
    public static final Bridge bridge = Tables.BRIDGE.as("br");
    public static final RouteBridge routebridge = Tables.ROUTE_BRIDGE.as("rbr");

    @Nullable
    @Override
    public RouteBridgeModel map(Record record) {
        BridgeModel bridgeModel = new BridgeModel();
        bridgeModel.setId(record.get(bridge.ID));
        bridgeModel.setName(record.get(bridge.NAME));
        bridgeModel.setIdentifier(record.get(bridge.IDENTIFIER));
        bridgeModel.setMunicipality(record.get(bridge.MUNICIPALITY));

        RouteBridgeModel model = new RouteBridgeModel();
        model.setId(record.get(routebridge.ID));
        model.setRouteId(record.get(routebridge.ROUTE_ID));
        model.setCrossingInstruction(record.get(routebridge.CROSSING_INSTRUCTION));
        model.setBridge(bridgeModel);
        model.setSupervision(new SupervisionModel());
        return model;
    }
}
