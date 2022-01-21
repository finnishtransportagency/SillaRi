package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.UnloadedTransportDimensionsModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class UnloadedTransportDimensionsMapper implements RecordMapper<Record, UnloadedTransportDimensionsModel> {
    @Nullable
    @Override
    public UnloadedTransportDimensionsModel map(Record record) {
        UnloadedTransportDimensionsModel model = new UnloadedTransportDimensionsModel();
        model.setId(record.get(TableAlias.unloadedTransportDimensions.ID));
        model.setPermitId(record.get(TableAlias.unloadedTransportDimensions.PERMIT_ID));
        model.setHeight(record.get(TableAlias.unloadedTransportDimensions.HEIGHT));
        model.setWidth(record.get(TableAlias.unloadedTransportDimensions.WIDTH));
        model.setLength(record.get(TableAlias.unloadedTransportDimensions.LENGTH));
        model.setRowCreatedTime(record.get(TableAlias.unloadedTransportDimensions.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.unloadedTransportDimensions.ROW_UPDATED_TIME));
        return model;
    }
}
