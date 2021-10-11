package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Supervision;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class SimpleSupervisionMapper implements RecordMapper<Record, SupervisionModel> {
    public static final Supervision supervision = Tables.SUPERVISION.as("sn");

    @Nullable
    @Override
    public SupervisionModel map(Record record) {
        SupervisionModel supervisionModel = new SupervisionModel();
        supervisionModel.setId(record.get(supervision.ID));
        supervisionModel.setRouteBridgeId(record.get(supervision.ROUTE_BRIDGE_ID));
        supervisionModel.setRouteTransportId(record.get(supervision.ROUTE_TRANSPORT_ID));
        supervisionModel.setPlannedTime(record.get(supervision.PLANNED_TIME));
        supervisionModel.setConformsToPermit(record.get(supervision.CONFORMS_TO_PERMIT));
        supervisionModel.setSupervisorType(record.get(supervision.SUPERVISOR_TYPE, new SupervisorTypeConverter(String.class, SupervisorType.class)));

        supervisionModel.setStatusHistory(new ArrayList<>());
        supervisionModel.setSupervisors(new ArrayList<>());
        supervisionModel.setImages(new ArrayList<>());

        return supervisionModel;
    }
}