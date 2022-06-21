package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.RouteTransportNumberModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteTransportNumberMapper implements RecordMapper<Record, RouteTransportNumberModel> {
    @Nullable
    @Override
    public RouteTransportNumberModel map(Record record) {
        RouteTransportNumberModel model = new RouteTransportNumberModel();
        model.setId(record.get(TableAlias.routeTransportNumber.ID));
        model.setRouteId(record.get(TableAlias.routeTransportNumber.ROUTE_ID));
        model.setRouteTransportId(record.get(TableAlias.routeTransportNumber.ROUTE_TRANSPORT_ID));
        model.setTransportNumber(record.get(TableAlias.routeTransportNumber.TRANSPORT_NUMBER));
        model.setUsed(record.get(TableAlias.routeTransportNumber.USED));
        model.setRowCreatedTime(record.get(TableAlias.routeTransportNumber.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.routeTransportNumber.ROW_UPDATED_TIME));
        return model;
    }
}
