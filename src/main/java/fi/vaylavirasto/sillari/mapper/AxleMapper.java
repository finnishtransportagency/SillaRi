package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.AxleModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class AxleMapper implements RecordMapper<Record, AxleModel> {
    @Nullable
    @Override
    public AxleModel map(Record record) {
        AxleModel model = new AxleModel();
        model.setId(record.get(TableAlias.axle.ID));
        model.setAxleChartId(record.get(TableAlias.axle.AXLE_CHART_ID));
        model.setAxleNumber(record.get(TableAlias.axle.AXLE_NUMBER));
        model.setWeight(record.get(TableAlias.axle.WEIGHT));
        model.setDistanceToNext(record.get(TableAlias.axle.DISTANCE_TO_NEXT));
        model.setMaxDistanceToNext(record.get(TableAlias.axle.MAX_DISTANCE_TO_NEXT));
        model.setRowCreatedTime(record.get(TableAlias.axle.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.axle.ROW_UPDATED_TIME));
        return model;
    }
}
