package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.RouteTransport;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteTransportMapper implements RecordMapper<Record, RouteTransportModel> {
    public static final RouteTransport transport = Tables.ROUTE_TRANSPORT.as("t");

    @Nullable
    @Override
    public RouteTransportModel map(Record record) {
        RouteTransportModel routeTransportModel = new RouteTransportModel();
        routeTransportModel.setId(record.get(transport.ID));
        routeTransportModel.setRouteId(record.get(transport.ROUTE_ID));
        routeTransportModel.setDepartureTime(record.get(transport.DEPARTURE_TIME));
        routeTransportModel.setArrivalTime(record.get(transport.ARRIVAL_TIME));
        routeTransportModel.setStatus(record.get(transport.STATUS, new TransportStatusConverter(String.class, TransportStatus.class)));
        routeTransportModel.setCurrentLocation(record.get(transport.CURRENT_LOCATION));
        routeTransportModel.setCurrentLocationUpdated(record.get(transport.CURRENT_LOCATION_UPDATED));
        return routeTransportModel;
    }
}
