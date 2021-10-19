package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.AxleChartModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class AxleChartMapper implements RecordMapper<Record, AxleChartModel> {
    @Nullable
    @Override
    public AxleChartModel map(Record record) {
        AxleChartModel axleChartModel = new AxleChartModel();
        axleChartModel.setId(record.get(TableAlias.axleChart.ID));
        axleChartModel.setPermitId(record.get(TableAlias.axleChart.PERMIT_ID));
        return axleChartModel;
    }
}
