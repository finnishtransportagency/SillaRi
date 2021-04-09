package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Bridge;
import fi.vaylavirasto.sillari.model.tables.RouteBridge;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteBridgeMapper implements RecordMapper<Record,BridgeModel> {
    public static final Bridge bridge = Tables.BRIDGE.as("br");
    public static final RouteBridge routebridge = Tables.ROUTE_BRIDGE.as("rbr");

    @Nullable
    @Override
    public BridgeModel map(Record record) {
        BridgeModel model = new BridgeModel();
        model.setId(record.get(bridge.ID));
        model.setName(record.get(bridge.NAME));
        model.setIdentifier(record.get(bridge.IDENTIFIER));
        return model;
    }
}
