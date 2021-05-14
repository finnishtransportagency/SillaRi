package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Supervision;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionMapper implements RecordMapper<Record, SupervisionModel> {
    public static final Supervision supervision = Tables.SUPERVISION.as("s");

    @Nullable
    @Override
    public SupervisionModel map(Record record) {
        SupervisionModel supervisionModel = new SupervisionModel();
        supervisionModel.setId(record.get(supervision.ID));
        supervisionModel.setRouteBridgeId(record.get(supervision.ROUTE_BRIDGE_ID));
        supervisionModel.setRouteTransportId(record.get(supervision.ROUTE_TRANSPORT_ID));
        supervisionModel.setPlannedTime(record.get(supervision.PLANNED_TIME));
        supervisionModel.setStatus(record.get(supervision.STATUS, new SupervisionStatusConverter(String.class, SupervisionStatus.class)));
        supervisionModel.setConformsToPermit(record.get(supervision.CONFORMS_TO_PERMIT));
        supervisionModel.setSupervisorId(record.get(supervision.SUPERVISOR_ID));
        return supervisionModel;
    }
}
