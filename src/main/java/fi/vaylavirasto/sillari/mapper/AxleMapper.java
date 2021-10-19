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
        AxleModel axleModel = new AxleModel();
        axleModel.setId(record.get(TableAlias.axle.ID));
        axleModel.setAxleChartId(record.get(TableAlias.axle.AXLE_CHART_ID));
        axleModel.setAxleNumber(record.get(TableAlias.axle.AXLE_NUMBER));
        axleModel.setWeight(record.get(TableAlias.axle.WEIGHT));
        axleModel.setDistanceToNext(record.get(TableAlias.axle.DISTANCE_TO_NEXT));
        axleModel.setMaxDistanceToNext(record.get(TableAlias.axle.MAX_DISTANCE_TO_NEXT));
        return axleModel;
    }
}
