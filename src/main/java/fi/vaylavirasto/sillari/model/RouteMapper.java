package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Address;
import fi.vaylavirasto.sillari.model.tables.Route;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class RouteMapper  implements RecordMapper<Record, RouteModel> {
    // Table aliases
    public static final Route route = Tables.ROUTE.as("r");
    public static final Address arrivalAddress = Tables.ADDRESS.as("aa");
    public static final Address departureAddress = Tables.ADDRESS.as("da");

    @Nullable
    @Override
    public RouteModel map(Record record) {
        RouteModel routeModel = new RouteModel();
        routeModel.setId(record.get(route.ID));
        routeModel.setPermitId(record.get(route.PERMIT_ID));
        routeModel.setLeluId(record.get(route.LELU_ID));
        routeModel.setName(record.get(route.NAME));
        routeModel.setOrder(record.get(route.ORDER));
        routeModel.setTransportCount(record.get(route.TRANSPORT_COUNT));
        routeModel.setRouteBridges(new ArrayList<>());
        routeModel.setCrossings(new ArrayList<>());

        AddressModel aa = new AddressModel();
        aa.setId(record.get(arrivalAddress.ID));
        aa.setStreet(record.get(arrivalAddress.STREET));
        aa.setPostalcode(record.get(arrivalAddress.POSTALCODE));
        aa.setCity(record.get(arrivalAddress.CITY));
        routeModel.setArrivalAddress(aa);

        AddressModel da = new AddressModel();
        da.setId(record.get(departureAddress.ID));
        da.setStreet(record.get(departureAddress.STREET));
        da.setPostalcode(record.get(departureAddress.POSTALCODE));
        da.setCity(record.get(departureAddress.CITY));
        routeModel.setDepartureAddress(da);

        return routeModel;
    }
}
