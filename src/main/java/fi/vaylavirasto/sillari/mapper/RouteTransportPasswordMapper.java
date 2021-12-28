package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.RouteTransportPasswordModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteTransportPasswordMapper implements RecordMapper<Record, RouteTransportPasswordModel> {
    @Nullable
    @Override
    public RouteTransportPasswordModel map(Record record) {
        RouteTransportPasswordModel model = new RouteTransportPasswordModel();
        model.setId(record.get(TableAlias.routeTransportPassword.ID));
        model.setRouteTransportId(record.get(TableAlias.routeTransportPassword.ROUTE_TRANSPORT_ID));
        model.setTransportPassword(record.get(TableAlias.routeTransportPassword.TRANSPORT_PASSWORD));
        model.setValidFrom(record.get(TableAlias.routeTransportPassword.VALID_FROM));
        model.setValidTo(record.get(TableAlias.routeTransportPassword.VALID_TO));
        model.setRowCreatedTime(record.get(TableAlias.routeTransportPassword.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.routeTransportPassword.ROW_UPDATED_TIME));
        return model;
    }
}
