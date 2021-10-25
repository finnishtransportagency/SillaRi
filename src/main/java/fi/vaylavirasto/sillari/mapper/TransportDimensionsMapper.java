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
        TransportDimensionsModel transportDimensionsModel = new TransportDimensionsModel();
        transportDimensionsModel.setId(record.get(TableAlias.transportDimensions.ID));
        transportDimensionsModel.setPermitId(record.get(TableAlias.transportDimensions.PERMIT_ID));
        transportDimensionsModel.setHeight(record.get(TableAlias.transportDimensions.HEIGHT));
        transportDimensionsModel.setWidth(record.get(TableAlias.transportDimensions.WIDTH));
        transportDimensionsModel.setLength(record.get(TableAlias.transportDimensions.LENGTH));
        return transportDimensionsModel;
    }
}
