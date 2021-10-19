package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.*;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionMapper implements RecordMapper<Record, SupervisionModel> {
    @Nullable
    @Override
    public SupervisionModel map(Record record) {
        SimplePermitMapper permitMapper = new SimplePermitMapper();
        PermitModel permitModel = permitMapper.map(record);

        SimpleRouteMapper routeMapper = new SimpleRouteMapper();
        RouteModel routeModel = routeMapper.map(record);
        if (routeModel != null) {
            routeModel.setPermit(permitModel);
        }

        RouteBridgeMapper routeBridgeMapper = new RouteBridgeMapper();
        RouteBridgeModel routeBridgeModel = routeBridgeMapper.map(record);
        if (routeBridgeModel != null) {
            routeBridgeModel.setRoute(routeModel);
        }

        RouteTransportMapper routeTransportMapper = new RouteTransportMapper();
        RouteTransportModel routeTransportModel = routeTransportMapper.map(record);

        SimpleSupervisionMapper supervisionMapper = new SimpleSupervisionMapper();
        SupervisionModel supervisionModel = supervisionMapper.map(record);
        if (supervisionModel != null) {
            supervisionModel.setRouteBridge(routeBridgeModel);
            supervisionModel.setRouteTransport(routeTransportModel);
        }

        return supervisionModel;
    }
}
