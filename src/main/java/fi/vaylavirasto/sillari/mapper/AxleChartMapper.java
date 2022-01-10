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
        AxleChartModel model = new AxleChartModel();
        model.setId(record.get(TableAlias.axleChart.ID));
        model.setPermitId(record.get(TableAlias.axleChart.PERMIT_ID));
        model.setRowCreatedTime(record.get(TableAlias.axleChart.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.axleChart.ROW_UPDATED_TIME));
        model.setAxles(new ArrayList<>());
        return model;
    }
}
