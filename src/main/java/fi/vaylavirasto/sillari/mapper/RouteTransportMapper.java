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
        RouteTransportModel model = new RouteTransportModel();
        model.setId(record.get(TableAlias.routeTransport.ID));
        model.setRouteId(record.get(TableAlias.routeTransport.ROUTE_ID));
        model.setPlannedDepartureTime(record.get(TableAlias.routeTransport.PLANNED_DEPARTURE_TIME));
        model.setTractorUnit(record.get(TableAlias.routeTransport.TRACTOR_UNIT));
        model.setRowCreatedTime(record.get(TableAlias.routeTransport.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.routeTransport.ROW_UPDATED_TIME));
        model.setStatusHistory(new ArrayList<>());
        model.setSupervisions(new ArrayList<>());
        return model;
    }
}
