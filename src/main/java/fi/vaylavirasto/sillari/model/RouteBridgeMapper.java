package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.*;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteBridgeMapper implements RecordMapper<Record,RouteBridgeModel> {
    public static final Bridge bridge = Tables.BRIDGE.as("br");
    public static final Route route = Tables.ROUTE.as("ro");
    public static final RouteBridge routebridge = Tables.ROUTE_BRIDGE.as("rbr");
    public static final Supervision supervision = Tables.SUPERVISION.as("sn");
    public static final SupervisionSupervisor supervisionSupervisor = Tables.SUPERVISION_SUPERVISOR.as("ss");

    @Nullable
    @Override
    public RouteBridgeModel map(Record record) {
        BridgeMapper bridgeMapper = new BridgeMapper();
        BridgeModel bridgeModel = bridgeMapper.map(record);

        SupervisionMapper supervisionMapper = new SupervisionMapper();
        SupervisionModel supervisionModel = supervisionMapper.map(record);

        RouteBridgeModel model = new RouteBridgeModel();
        model.setId(record.get(routebridge.ID));
        model.setRouteId(record.get(routebridge.ROUTE_ID));
        model.setBridgeId(record.get(routebridge.BRIDGE_ID));
        model.setCrossingInstruction(record.get(routebridge.CROSSING_INSTRUCTION));
        model.setBridge(bridgeModel);
        model.setSupervision(supervisionModel);

        return model;
    }
}
