package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.AddressModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteMapper implements RecordMapper<Record, RouteModel> {
    @Nullable
    @Override
    public RouteModel map(Record record) {
        SimpleRouteMapper simpleRouteMapper = new SimpleRouteMapper();
        RouteModel routeModel = simpleRouteMapper.map(record);

        if (routeModel != null) {
            AddressModel aa = new AddressModel();
            aa.setId(record.get(TableAlias.arrivalAddress.ID));
            aa.setStreetAddress(record.get(TableAlias.arrivalAddress.STREETADDRESS));
            routeModel.setArrivalAddress(aa);

            AddressModel da = new AddressModel();
            da.setId(record.get(TableAlias.departureAddress.ID));
            da.setStreetAddress(record.get(TableAlias.departureAddress.STREETADDRESS));
            routeModel.setDepartureAddress(da);
        }

        return routeModel;
    }
}
