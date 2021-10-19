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
        RouteTransportStatusModel transportStatusModel = new RouteTransportStatusModel();
        transportStatusModel.setId(record.get(TableAlias.transportStatus.ID));
        transportStatusModel.setRouteTransportId(record.get(TableAlias.transportStatus.ROUTE_TRANSPORT_ID));
        transportStatusModel.setStatus(record.get(TableAlias.transportStatus.STATUS, new TransportStatusTypeConverter(String.class, TransportStatusType.class)));
        transportStatusModel.setTime(record.get(TableAlias.transportStatus.TIME));
        return transportStatusModel;
    }
}
