package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.RouteTransport;
import fi.vaylavirasto.sillari.model.tables.RouteTransportStatus;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class RouteTransportMapper implements RecordMapper<Record, RouteTransportModel> {
    public static final RouteTransport transport = Tables.ROUTE_TRANSPORT.as("rt");
    public static final RouteTransportStatus transportStatus = Tables.ROUTE_TRANSPORT_STATUS.as("rts");

    @Nullable
    @Override
    public RouteTransportModel map(Record record) {
        RouteTransportModel routeTransportModel = new RouteTransportModel();
        routeTransportModel.setId(record.get(transport.ID));
        routeTransportModel.setRouteId(record.get(transport.ROUTE_ID));

        RouteTransportStatusModel statusModel = new RouteTransportStatusModel();
        statusModel.setId(record.get(transportStatus.ID));
        statusModel.setRouteTransportId(record.get(transportStatus.ROUTE_TRANSPORT_ID));
        statusModel.setStatus(record.get(transportStatus.STATUS, new TransportStatusTypeConverter(String.class, TransportStatusType.class)));
        statusModel.setTime(record.get(transportStatus.TIME));
        routeTransportModel.setCurrentStatus(statusModel);

        routeTransportModel.setStatusHistory(new ArrayList<>());
        routeTransportModel.setSupervisions(new ArrayList<>());
        return routeTransportModel;
    }
}
