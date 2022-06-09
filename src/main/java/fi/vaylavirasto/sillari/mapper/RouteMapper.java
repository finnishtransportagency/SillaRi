package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class RouteMapper implements RecordMapper<Record, RouteModel> {
    @Nullable
    @Override
    public RouteModel map(Record record) {
        RouteModel model = new RouteModel();
        model.setId(record.get(TableAlias.route.ID));
        model.setPermitId(record.get(TableAlias.route.PERMIT_ID));
        model.setDepartureAddressId(record.get(TableAlias.route.DEPARTURE_ADDRESS_ID));
        model.setArrivalAddressId(record.get(TableAlias.route.ARRIVAL_ADDRESS_ID));
        model.setLeluId(record.get(TableAlias.route.LELU_ID));
        model.setName(record.get(TableAlias.route.NAME));
        model.setTransportCount(record.get(TableAlias.route.TRANSPORT_COUNT));
        model.setAlternativeRoute(record.get(TableAlias.route.ALTERNATIVE_ROUTE));
        model.setRowCreatedTime(record.get(TableAlias.route.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.route.ROW_UPDATED_TIME));
        model.setRouteBridges(new ArrayList<>());
        model.setRouteTransportCounts(new ArrayList<>());
        return model;
    }
}
