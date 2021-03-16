package fi.vaylavirasto.sillari.model;
import fi.vaylavirasto.sillari.model.BridgeModel;

import fi.vaylavirasto.sillari.model.tables.Bridge;
import fi.vaylavirasto.sillari.model.tables.Crossing;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class CrossingMapper implements RecordMapper<Record,CrossingModel> {
    public static final Crossing crossing = Tables.CROSSING.as("c");
    public static final Bridge bridge = Tables.BRIDGE.as("b");

    @Nullable
    @Override
    public CrossingModel map(Record record) {
        CrossingModel crossingModel = new CrossingModel();
        crossingModel.setId(record.get(crossing.ID));

        BridgeModel bridgeModel = new BridgeModel();
        bridgeModel.setId(record.get(bridge.ID));
        bridgeModel.setName(record.get(bridge.NAME));
        crossingModel.setBridge(bridgeModel);
        crossingModel.setDescribe(false);
        crossingModel.setDrivingLineInfo(true);
        crossingModel.setSpeedInfo(true);
        crossingModel.setExceptionsInfo(false);

        return crossingModel;
    }
}
