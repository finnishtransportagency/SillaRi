package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.Tables;
import fi.vaylavirasto.sillari.model.tables.Route;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class SimpleRouteMapper implements RecordMapper<Record, RouteModel> {
    public static final Route route = Tables.ROUTE.as("ro");

    @Nullable
    @Override
    public RouteModel map(Record record) {
        RouteModel routeModel = new RouteModel();
        routeModel.setId(record.get(route.ID));
        routeModel.setPermitId(record.get(route.PERMIT_ID));
        routeModel.setLeluId(record.get(route.LELU_ID));
        routeModel.setName(record.get(route.NAME));
        routeModel.setTransportCount(record.get(route.TRANSPORT_COUNT));
        routeModel.setAlternativeRoute(record.get(route.ALTERNATIVE_ROUTE));
        routeModel.setRouteBridges(new ArrayList<>());
        return routeModel;
    }
}
