package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.*;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

/**
 * Used for mapping route bridges to parent bridge.
 * No bridge mapped to route bridge, since data is included in parent.
 * Only name and valid time of permit needed, no route or permit details.
 */
public class RouteBridgeOfBridgeMapper implements RecordMapper<Record,RouteBridgeModel> {
    public static final Permit permit = Tables.PERMIT.as("pe");
    public static final Route route = Tables.ROUTE.as("ro");
    public static final RouteBridge routebridge = Tables.ROUTE_BRIDGE.as("rbr");
    public static final Supervision supervision = Tables.SUPERVISION.as("sn");

    @Nullable
    @Override
    public RouteBridgeModel map(Record record) {
        RouteBridgeModel routeBridgeModel = new RouteBridgeModel();
        routeBridgeModel.setId(record.get(routebridge.ID));
        routeBridgeModel.setRouteId(record.get(routebridge.ROUTE_ID));
        routeBridgeModel.setBridgeId(record.get(routebridge.BRIDGE_ID));
        routeBridgeModel.setCrossingInstruction(record.get(routebridge.CROSSING_INSTRUCTION));

        PermitModel permitModel = new PermitModel();
        permitModel.setId(record.get(permit.ID));
        permitModel.setPermitNumber(record.get(permit.PERMIT_NUMBER));
        permitModel.setValidStartDate(record.get(permit.VALID_START_DATE));
        permitModel.setValidEndDate(record.get(permit.VALID_END_DATE));

        RouteModel routeModel = new RouteModel();
        routeModel.setPermit(permitModel);
        routeBridgeModel.setRoute(routeModel);

        SupervisionMapper supervisionMapper = new SupervisionMapper();
        SupervisionModel supervisionModel = supervisionMapper.map(record);
        routeBridgeModel.setSupervision(supervisionModel);

        return routeBridgeModel;
    }
}
