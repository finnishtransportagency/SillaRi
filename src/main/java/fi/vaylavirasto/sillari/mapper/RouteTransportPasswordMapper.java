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
        RouteTransportPasswordModel rtpm = new RouteTransportPasswordModel();
        rtpm.setId(record.get(TableAlias.routeTransportPassword.ID));
        rtpm.setRouteTransportId(record.get(TableAlias.routeTransportPassword.ROUTE_TRANSPORT_ID));
        rtpm.setTransportPassword(record.get(TableAlias.routeTransportPassword.TRANSPORT_PASSWORD));
        rtpm.setValidFrom(record.get(TableAlias.routeTransportPassword.VALID_FROM));
        rtpm.setValidTo(record.get(TableAlias.routeTransportPassword.VALID_TO));
        return rtpm;
    }
}
