package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Address;
import fi.vaylavirasto.sillari.model.tables.Route;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteMapper implements RecordMapper<Record, RouteModel> {
    // Table aliases
    public static final Route route = Tables.ROUTE.as("ro");
    public static final Address arrivalAddress = Tables.ADDRESS.as("aa");
    public static final Address departureAddress = Tables.ADDRESS.as("da");

    @Nullable
    @Override
    public RouteModel map(Record record) {
        SimpleRouteMapper simpleRouteMapper = new SimpleRouteMapper();
        RouteModel routeModel = simpleRouteMapper.map(record);

        if (routeModel != null) {
            AddressModel aa = new AddressModel();
            aa.setId(record.get(arrivalAddress.ID));
            aa.setStreetaddress(record.get(arrivalAddress.STREETADDRESS));
            routeModel.setArrivalAddress(aa);

            AddressModel da = new AddressModel();
            da.setId(record.get(departureAddress.ID));
            da.setStreetaddress(record.get(departureAddress.STREETADDRESS));
            routeModel.setDepartureAddress(da);
        }

        return routeModel;
    }
}
