package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class RouteTransportMapper implements RecordMapper<Record, RouteTransportModel> {
    @Nullable
    @Override
    public RouteTransportModel map(Record record) {
        RouteTransportModel routeTransportModel = new RouteTransportModel();
        routeTransportModel.setId(record.get(TableAlias.routeTransport.ID));
        routeTransportModel.setRouteId(record.get(TableAlias.routeTransport.ROUTE_ID));
        routeTransportModel.setPlannedDepartureTime(record.get(TableAlias.routeTransport.PLANNED_DEPARTURE_TIME));
        routeTransportModel.setStatusHistory(new ArrayList<>());
        routeTransportModel.setSupervisions(new ArrayList<>());
        return routeTransportModel;
    }
}
