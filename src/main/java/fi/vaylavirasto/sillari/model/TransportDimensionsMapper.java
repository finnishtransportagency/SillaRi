package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.TransportDimensions;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.math.BigDecimal;

public class TransportDimensionsMapper implements RecordMapper<Record, TransportDimensionsModel> {
    public static final TransportDimensions transportDimensions = Tables.TRANSPORT_DIMENSIONS.as("t");

    @Nullable
    @Override
    public TransportDimensionsModel map(Record record) {
        TransportDimensionsModel transportDimensionsModel = new TransportDimensionsModel();
        transportDimensionsModel.setId(record.get(transportDimensions.ID));
        transportDimensionsModel.setPermitId(record.get(transportDimensions.PERMIT_ID));
        BigDecimal height = record.get(transportDimensions.HEIGHT);
        transportDimensionsModel.setHeight(height != null ? height.doubleValue() : null);
        BigDecimal width = record.get(transportDimensions.WIDTH);
        transportDimensionsModel.setWidth(width != null ? width.doubleValue() : null);
        BigDecimal length = record.get(transportDimensions.LENGTH);
        transportDimensionsModel.setLength(length != null ? length.doubleValue() : null);
        return transportDimensionsModel;
    }
}
