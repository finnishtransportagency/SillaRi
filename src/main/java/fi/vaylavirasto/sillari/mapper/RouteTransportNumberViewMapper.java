package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.RouteTransportNumberModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteTransportNumberViewMapper implements RecordMapper<Record, RouteTransportNumberModel> {
    @Nullable
    @Override
    public RouteTransportNumberModel map(Record record) {
        RouteTransportNumberModel model = new RouteTransportNumberModel();
        model.setId(record.get(TableAlias.routeTransportNumberView.ID));
        model.setRouteId(record.get(TableAlias.routeTransportNumberView.ROUTE_ID));
        model.setRouteLeluId(record.get(TableAlias.routeTransportNumberView.ROUTE_LELU_ID));
        model.setRouteTotalTransportCount(record.get(TableAlias.routeTransportNumberView.ROUTE_TOTAL_TRANSPORT_COUNT));
        model.setPermitId(record.get(TableAlias.routeTransportNumberView.PERMIT_ID));
        model.setPermitNumber(record.get(TableAlias.routeTransportNumberView.PERMIT_NUMBER));
        model.setPermitLeluVersion(record.get(TableAlias.routeTransportNumberView.PERMIT_LELU_VERSION));
        model.setPermitIsCurrentVersion(record.get(TableAlias.routeTransportNumberView.PERMIT_IS_CURRENT_VERSION));
        model.setRouteTransportId(record.get(TableAlias.routeTransportNumberView.ROUTE_TRANSPORT_ID));
        model.setTransportNumber(record.get(TableAlias.routeTransportNumberView.TRANSPORT_NUMBER));
        model.setUsed(record.get(TableAlias.routeTransportNumberView.USED));
        model.setRowCreatedTime(record.get(TableAlias.routeTransportNumberView.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.routeTransportNumberView.ROW_UPDATED_TIME));
        return model;
    }
}
