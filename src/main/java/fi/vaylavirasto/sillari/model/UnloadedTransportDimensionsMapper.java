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
        UnloadedTransportDimensionsModel transportDimensionsModel = new UnloadedTransportDimensionsModel();
        transportDimensionsModel.setId(record.get(unloadedTransportDimensions.ID));
        transportDimensionsModel.setPermitId(record.get(unloadedTransportDimensions.PERMIT_ID));
        transportDimensionsModel.setHeight(record.get(unloadedTransportDimensions.HEIGHT));
        transportDimensionsModel.setWidth(record.get(unloadedTransportDimensions.WIDTH));
        transportDimensionsModel.setLength(record.get(unloadedTransportDimensions.LENGTH));
        return transportDimensionsModel;
    }
}
