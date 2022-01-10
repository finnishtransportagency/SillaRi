package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.TransportDimensionsModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class TransportDimensionsMapper implements RecordMapper<Record, TransportDimensionsModel> {
    @Nullable
    @Override
    public TransportDimensionsModel map(Record record) {
        TransportDimensionsModel model = new TransportDimensionsModel();
        model.setId(record.get(TableAlias.transportDimensions.ID));
        model.setPermitId(record.get(TableAlias.transportDimensions.PERMIT_ID));
        model.setHeight(record.get(TableAlias.transportDimensions.HEIGHT));
        model.setWidth(record.get(TableAlias.transportDimensions.WIDTH));
        model.setLength(record.get(TableAlias.transportDimensions.LENGTH));
        model.setRowCreatedTime(record.get(TableAlias.transportDimensions.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.transportDimensions.ROW_UPDATED_TIME));
        return model;
    }
}
