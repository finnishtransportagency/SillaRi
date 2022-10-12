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
        SupervisionModel model = new SupervisionModel();
        model.setId(record.get(TableAlias.supervision.ID));
        model.setRouteBridgeId(record.get(TableAlias.supervision.ROUTE_BRIDGE_ID));
        model.setRouteTransportId(record.get(TableAlias.supervision.ROUTE_TRANSPORT_ID));
        model.setPlannedTime(record.get(TableAlias.supervision.PLANNED_TIME));
        model.setConformsToPermit(record.get(TableAlias.supervision.CONFORMS_TO_PERMIT));
        model.setSupervisorCompany(record.get(TableAlias.supervision.SUPERVISOR_COMPANY));
        model.setSupervisorCompanyName(record.get(TableAlias.company.NAME));
        model.setSupervisorType(record.get(TableAlias.supervision.SUPERVISOR_TYPE, new SupervisorTypeConverter(String.class, SupervisorType.class)));
        model.setRowCreatedTime(record.get(TableAlias.supervision.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.supervision.ROW_UPDATED_TIME));
        model.setStatusHistory(new ArrayList<>());
        model.setImages(new ArrayList<>());
        return model;
    }
}
