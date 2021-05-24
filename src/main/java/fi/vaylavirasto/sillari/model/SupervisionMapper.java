package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Supervision;
import fi.vaylavirasto.sillari.model.tables.SupervisionStatus;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class SupervisionMapper implements RecordMapper<Record, SupervisionModel> {
    public static final Supervision supervision = Tables.SUPERVISION.as("s");
    public static final SupervisionStatus supervisionStatus = Tables.SUPERVISION_STATUS.as("ss");

    @Nullable
    @Override
    public SupervisionModel map(Record record) {
        SupervisionModel supervisionModel = new SupervisionModel();
        supervisionModel.setId(record.get(supervision.ID));
        supervisionModel.setRouteBridgeId(record.get(supervision.ROUTE_BRIDGE_ID));
        supervisionModel.setRouteTransportId(record.get(supervision.ROUTE_TRANSPORT_ID));
        supervisionModel.setSupervisorId(record.get(supervision.SUPERVISOR_ID));
        supervisionModel.setPlannedTime(record.get(supervision.PLANNED_TIME));
        supervisionModel.setConformsToPermit(record.get(supervision.CONFORMS_TO_PERMIT));

        SupervisionStatusModel statusModel = new SupervisionStatusModel();
        statusModel.setId(record.get(supervisionStatus.ID));
        statusModel.setSupervisionId(record.get(supervisionStatus.SUPERVISION_ID));
        statusModel.setStatus(record.get(supervisionStatus.STATUS, new SupervisionStatusTypeConverter(String.class, SupervisionStatusType.class)));
        statusModel.setTime(record.get(supervisionStatus.TIME));

        supervisionModel.setCurrentStatus(statusModel);
        supervisionModel.setStatusHistory(new ArrayList<>());
        return supervisionModel;
    }
}
