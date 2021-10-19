package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.model.SupervisorType;
import fi.vaylavirasto.sillari.model.SupervisorTypeConverter;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class SupervisionMapper implements RecordMapper<Record, SupervisionModel> {
    @Nullable
    @Override
    public SupervisionModel map(Record record) {
        SupervisionModel supervisionModel = new SupervisionModel();
        supervisionModel.setId(record.get(TableAlias.supervision.ID));
        supervisionModel.setRouteBridgeId(record.get(TableAlias.supervision.ROUTE_BRIDGE_ID));
        supervisionModel.setRouteTransportId(record.get(TableAlias.supervision.ROUTE_TRANSPORT_ID));
        supervisionModel.setPlannedTime(record.get(TableAlias.supervision.PLANNED_TIME));
        supervisionModel.setConformsToPermit(record.get(TableAlias.supervision.CONFORMS_TO_PERMIT));
        supervisionModel.setSupervisorType(record.get(TableAlias.supervision.SUPERVISOR_TYPE, new SupervisorTypeConverter(String.class, SupervisorType.class)));
        supervisionModel.setStatusHistory(new ArrayList<>());
        supervisionModel.setSupervisors(new ArrayList<>());
        supervisionModel.setImages(new ArrayList<>());
        return supervisionModel;
    }
}
