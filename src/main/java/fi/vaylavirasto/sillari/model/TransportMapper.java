package fi.vaylavirasto.sillari.model;
import com.google.common.collect.Lists;

import fi.vaylavirasto.sillari.model.tables.Address;
import fi.vaylavirasto.sillari.model.tables.Transport;
import fi.vaylavirasto.sillari.model.tables.Company;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

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
        return transportModel;
    }
}
