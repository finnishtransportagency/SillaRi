package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Bridge;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class BridgeMapper implements RecordMapper<Record, BridgeModel> {
    public static final Bridge bridge = Tables.BRIDGE.as("b");

    @Nullable
    @Override
    public BridgeModel map(Record record) {
        BridgeModel model = new BridgeModel();
        model.setId(record.get(bridge.ID));
        model.setName(record.get(bridge.NAME));
        model.setIdentifier(record.get(bridge.IDENTIFIER));
        model.setMunicipality(record.get(bridge.MUNICIPALITY));
        model.setRouteBridges(new ArrayList<>());
        return model;
    }
}
