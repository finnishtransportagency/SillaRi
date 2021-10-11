package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.model.tables.*;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionMapper implements RecordMapper<Record, SupervisionModel> {
    public static final Permit permit = Tables.PERMIT.as("pe");
    public static final Route route = Tables.ROUTE.as("ro");
    public static final RouteBridge routeBridge = Tables.ROUTE_BRIDGE.as("rbr");
    public static final Bridge bridge = Tables.BRIDGE.as("br");
    public static final RouteTransport routeTransport = Tables.ROUTE_TRANSPORT.as("rtr");
    public static final Supervision supervision = Tables.SUPERVISION.as("sn");
    public static final SupervisionSupervisor supervisionSupervisor = Tables.SUPERVISION_SUPERVISOR.as("ss");

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
