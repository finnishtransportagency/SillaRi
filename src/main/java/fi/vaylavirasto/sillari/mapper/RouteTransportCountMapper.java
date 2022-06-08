package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.RouteTransportCountModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteTransportCountMapper implements RecordMapper<Record, RouteTransportCountModel> {
    @Nullable
    @Override
    public RouteTransportCountModel map(Record record) {
        RouteTransportCountModel model = new RouteTransportCountModel();
        model.setId(record.get(TableAlias.routeTransportCount.ID));
        model.setRouteId(record.get(TableAlias.routeTransportCount.ROUTE_ID));
        model.setRouteTransportId(record.get(TableAlias.routeTransportCount.ROUTE_TRANSPORT_ID));
        model.setCount(record.get(TableAlias.routeTransportCount.COUNT));
        model.setUsed(record.get(TableAlias.routeTransportCount.USED));
        model.setRowCreatedTime(record.get(TableAlias.routeTransportCount.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.routeTransportCount.ROW_UPDATED_TIME));
        return model;
    }
}
