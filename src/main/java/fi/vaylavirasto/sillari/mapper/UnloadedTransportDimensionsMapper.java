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
        UnloadedTransportDimensionsModel unloadedTransportDimensionsModel = new UnloadedTransportDimensionsModel();
        unloadedTransportDimensionsModel.setId(record.get(TableAlias.unloadedTransportDimensions.ID));
        unloadedTransportDimensionsModel.setPermitId(record.get(TableAlias.unloadedTransportDimensions.PERMIT_ID));
        unloadedTransportDimensionsModel.setHeight(record.get(TableAlias.unloadedTransportDimensions.HEIGHT));
        unloadedTransportDimensionsModel.setWidth(record.get(TableAlias.unloadedTransportDimensions.WIDTH));
        unloadedTransportDimensionsModel.setLength(record.get(TableAlias.unloadedTransportDimensions.LENGTH));
        return unloadedTransportDimensionsModel;
    }
}
