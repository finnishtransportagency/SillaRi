package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.RouteTransportStatusModel;
import fi.vaylavirasto.sillari.model.TransportStatusType;
import fi.vaylavirasto.sillari.model.TransportStatusTypeConverter;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteTransportStatusMapper implements RecordMapper<Record, RouteTransportStatusModel> {
    @Nullable
    @Override
    public RouteTransportStatusModel map(Record record) {
        RouteTransportStatusModel model = new RouteTransportStatusModel();
        model.setId(record.get(TableAlias.transportStatus.ID));
        model.setRouteTransportId(record.get(TableAlias.transportStatus.ROUTE_TRANSPORT_ID));
        model.setStatus(record.get(TableAlias.transportStatus.STATUS, new TransportStatusTypeConverter(String.class, TransportStatusType.class)));
        model.setTime(record.get(TableAlias.transportStatus.TIME));
        model.setRowCreatedTime(record.get(TableAlias.transportStatus.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.transportStatus.ROW_UPDATED_TIME));
        return model;
    }
}
