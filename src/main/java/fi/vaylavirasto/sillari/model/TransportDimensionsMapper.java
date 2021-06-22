package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.TransportDimensions;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.math.BigDecimal;

public class TransportDimensionsMapper implements RecordMapper<Record, TransportDimensionsModel> {
    public static final TransportDimensions transportDimensions = Tables.TRANSPORT_DIMENSIONS.as("td");

    @Nullable
    @Override
    public TransportDimensionsModel map(Record record) {
        TransportDimensionsModel transportDimensionsModel = new TransportDimensionsModel();
        transportDimensionsModel.setId(record.get(transportDimensions.ID));
        transportDimensionsModel.setPermitId(record.get(transportDimensions.PERMIT_ID));
        transportDimensionsModel.setHeight(record.get(transportDimensions.HEIGHT));
        transportDimensionsModel.setWidth(record.get(transportDimensions.WIDTH));
        transportDimensionsModel.setLength(record.get(transportDimensions.LENGTH));
        return transportDimensionsModel;
    }
}
