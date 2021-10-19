package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.PermitModel;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class PermitMapper implements RecordMapper<Record, PermitModel> {

    @Nullable
    @Override
    public PermitModel map(Record record) {
        SimplePermitMapper simplePermitMapper = new SimplePermitMapper();
        PermitModel permitModel = simplePermitMapper.map(record);

        if (permitModel != null) {
            TransportDimensionsMapper transportDimensionsMapper = new TransportDimensionsMapper();
            permitModel.setTransportDimensions(transportDimensionsMapper.map(record));

            UnloadedTransportDimensionsMapper unloadedTransportDimensionsMapper = new UnloadedTransportDimensionsMapper();
            permitModel.setUnloadedTransportDimensions(unloadedTransportDimensionsMapper.map(record));

            AxleChartMapper axleChartMapper = new AxleChartMapper();
            permitModel.setAxleChart(axleChartMapper.map(record));
        }

        return permitModel;
    }
}
