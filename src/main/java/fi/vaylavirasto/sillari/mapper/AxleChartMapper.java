package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.AxleChartModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class AxleChartMapper implements RecordMapper<Record, AxleChartModel> {
    @Nullable
    @Override
    public AxleChartModel map(Record record) {
        AxleChartModel axleChartModel = new AxleChartModel();
        axleChartModel.setId(record.get(TableAlias.axleChart.ID));
        axleChartModel.setPermitId(record.get(TableAlias.axleChart.PERMIT_ID));
        axleChartModel.setAxles(new ArrayList<>());
        return axleChartModel;
    }
}
