package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.UnloadedTransportDimensions;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class UnloadedTransportDimensionsMapper implements RecordMapper<Record, UnloadedTransportDimensionsModel> {
    public static final UnloadedTransportDimensions unloadedTransportDimensions = Tables.UNLOADED_TRANSPORT_DIMENSIONS.as("ud");

    @Nullable
    @Override
    public UnloadedTransportDimensionsModel map(Record record) {
        UnloadedTransportDimensionsModel unloadedTransportDimensionsModel = new UnloadedTransportDimensionsModel();
        unloadedTransportDimensionsModel.setId(record.get(unloadedTransportDimensions.ID));
        unloadedTransportDimensionsModel.setPermitId(record.get(unloadedTransportDimensions.PERMIT_ID));
        unloadedTransportDimensionsModel.setHeight(record.get(unloadedTransportDimensions.HEIGHT));
        unloadedTransportDimensionsModel.setWidth(record.get(unloadedTransportDimensions.WIDTH));
        unloadedTransportDimensionsModel.setLength(record.get(unloadedTransportDimensions.LENGTH));
        return unloadedTransportDimensionsModel;
    }
}
