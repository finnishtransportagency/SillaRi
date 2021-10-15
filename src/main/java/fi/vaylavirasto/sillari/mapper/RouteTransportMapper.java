package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteTransportMapper implements RecordMapper<Record, RouteTransportModel> {

    @Nullable
    @Override
    public RouteTransportModel map(Record record) {
        SimpleRouteTransportMapper simpleRouteTransportMapper = new SimpleRouteTransportMapper();
        RouteTransportModel routeTransportModel = simpleRouteTransportMapper.map(record);

        if (routeTransportModel != null) {
            RouteMapper routeMapper = new RouteMapper();
            RouteModel routeModel = routeMapper.map(record);
            routeTransportModel.setRoute(routeModel);

            SimplePermitMapper permitMapper = new SimplePermitMapper();
            PermitModel permitModel = permitMapper.map(record);

            if (routeModel != null) {
                routeModel.setPermit(permitModel);
            }

            CompanyMapper companyMapper = new CompanyMapper();
            CompanyModel companyModel = companyMapper.map(record);

            if (permitModel != null) {
                permitModel.setCompany(companyModel);
            }
        }
        return routeTransportModel;
    }
}
