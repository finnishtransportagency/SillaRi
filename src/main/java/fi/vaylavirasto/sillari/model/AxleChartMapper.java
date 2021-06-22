package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.AxleChart;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class AxleChartMapper implements RecordMapper<Record, AxleChartModel> {
    public static final AxleChart axleChart = Tables.AXLE_CHART.as("ac");

    @Nullable
    @Override
    public AxleChartModel map(Record record) {
        AxleChartModel axleChartModel = new AxleChartModel();
        axleChartModel.setId(record.get(axleChart.ID));
        axleChartModel.setPermitId(record.get(axleChart.PERMIT_ID));
        return axleChartModel;
    }
}
