package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Permit;
import fi.vaylavirasto.sillari.model.tables.Route;
import fi.vaylavirasto.sillari.model.tables.RouteTransport;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class RouteTransportMapper implements RecordMapper<Record, RouteTransportModel> {
    public static final RouteTransport transport = Tables.ROUTE_TRANSPORT.as("rt");
    public static final Route route = Tables.ROUTE.as("ro");
    public static final Permit permit = Tables.PERMIT.as("pe");

    @Nullable
    @Override
    public RouteTransportModel map(Record record) {
        RouteTransportModel routeTransportModel = new RouteTransportModel();
        routeTransportModel.setId(record.get(transport.ID));
        routeTransportModel.setRouteId(record.get(transport.ROUTE_ID));
        routeTransportModel.setPlannedDepartureTime(record.get(transport.PLANNED_DEPARTURE_TIME));

        routeTransportModel.setStatusHistory(new ArrayList<>());
        routeTransportModel.setSupervisions(new ArrayList<>());
        return routeTransportModel;
    }
}
