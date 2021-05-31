package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.RouteTransportStatus;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteTransportStatusMapper implements RecordMapper<Record, RouteTransportStatusModel> {
    public static final RouteTransportStatus transportStatus = Tables.ROUTE_TRANSPORT_STATUS.as("ts");

    @Nullable
    @Override
    public RouteTransportStatusModel map(Record record) {
        RouteTransportStatusModel transportStatusModel = new RouteTransportStatusModel();
        transportStatusModel.setId(record.get(transportStatus.ID));
        transportStatusModel.setRouteTransportId(record.get(transportStatus.ROUTE_TRANSPORT_ID));
        transportStatusModel.setStatus(record.get(transportStatus.STATUS, new TransportStatusTypeConverter(String.class, TransportStatusType.class)));
        transportStatusModel.setTime(record.get(transportStatus.TIME));
        return transportStatusModel;
    }
}
