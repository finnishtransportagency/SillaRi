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
        RouteModel routeModel = new RouteModel();
        routeModel.setId(record.get(TableAlias.route.ID));
        routeModel.setPermitId(record.get(TableAlias.route.PERMIT_ID));
        routeModel.setDepartureAddressId(record.get(TableAlias.route.DEPARTURE_ADDRESS_ID));
        routeModel.setArrivalAddressId(record.get(TableAlias.route.ARRIVAL_ADDRESS_ID));
        routeModel.setLeluId(record.get(TableAlias.route.LELU_ID));
        routeModel.setName(record.get(TableAlias.route.NAME));
        routeModel.setTransportCount(record.get(TableAlias.route.TRANSPORT_COUNT));
        routeModel.setAlternativeRoute(record.get(TableAlias.route.ALTERNATIVE_ROUTE));
        routeModel.setRouteBridges(new ArrayList<>());
        return routeModel;
    }
}
