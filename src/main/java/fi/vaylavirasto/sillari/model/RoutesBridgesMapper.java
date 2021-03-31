package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Bridge;
import fi.vaylavirasto.sillari.model.tables.Routesbridges;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RoutesBridgesMapper implements RecordMapper<Record,BridgeModel> {
    public static final Bridge bridge = Tables.BRIDGE.as("br");
    public static final Routesbridges routesbridges  = Tables.ROUTESBRIDGES.as("rbr");

    @Nullable
    @Override
    public BridgeModel map(Record record) {
        BridgeModel model = new BridgeModel();
        model.setId(record.get(bridge.ID));
        model.setName(record.get(bridge.NAME));
        return model;
    }
}
