package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Axle;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.math.BigDecimal;

public class AxleMapper implements RecordMapper<Record, AxleModel> {
    public static final Axle axle = Tables.AXLE.as("a");

    @Nullable
    @Override
    public AxleModel map(Record record) {
        AxleModel axleModel = new AxleModel();
        axleModel.setId(record.get(axle.ID));
        axleModel.setAxleChartId(record.get(axle.AXLE_CHART_ID));
        axleModel.setAxleNumber(record.get(axle.AXLE_NUMBER));
        BigDecimal weight = record.get(axle.WEIGHT);
        axleModel.setWeight(weight != null ? weight.doubleValue() : null);
        BigDecimal distanceToNext = record.get(axle.DISTANCE_TO_NEXT);
        axleModel.setDistanceToNext(distanceToNext != null ? distanceToNext.doubleValue() : null);
        BigDecimal maxDistanceToNext = record.get(axle.MAX_DISTANCE_TO_NEXT);
        axleModel.setMaxDistanceToNext(maxDistanceToNext != null ? maxDistanceToNext.doubleValue() : null);
        return axleModel;
    }
}
