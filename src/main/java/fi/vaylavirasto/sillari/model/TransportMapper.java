package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Transport;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.math.BigDecimal;
import java.util.ArrayList;

public class TransportMapper implements RecordMapper<Record, TransportModel> {
    public static final Transport transport = Tables.TRANSPORT.as("t");

    @Nullable
    @Override
    public TransportModel map(Record record) {
        TransportModel transportModel = new TransportModel();
        transportModel.setId(record.get(transport.ID));
        transportModel.setPermitId(record.get(transport.PERMIT_ID));
        transportModel.setRouteId(record.get(transport.ROUTE_ID));
        transportModel.setName(record.get(transport.NAME));
        BigDecimal height = record.get(transport.HEIGHT);
        transportModel.setHeight(height != null ? height.doubleValue() : null);
        BigDecimal width = record.get(transport.WIDTH);
        transportModel.setWidth(width != null ? width.doubleValue() : null);
        BigDecimal length = record.get(transport.LENGTH);
        transportModel.setLength(length != null ? length.doubleValue() : null);
        BigDecimal totalMass = record.get(transport.TOTAL_MASS);
        transportModel.setTotalMass(totalMass != null ? totalMass.doubleValue() : null);
        transportModel.setRegistrations(new ArrayList<>());
        transportModel.setAxles(new ArrayList<>());
        return transportModel;
    }
}
