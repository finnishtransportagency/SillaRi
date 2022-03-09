package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.SupervisorModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionSupervisorMapper implements RecordMapper<Record, SupervisorModel> {
    @Nullable
    @Override
    public SupervisorModel map(Record record) {
        SupervisorModel model = new SupervisorModel();
        model.setId(record.get(TableAlias.supervisionSupervisor.ID));
        model.setUsername(record.get(TableAlias.supervisionSupervisor.USERNAME));
        model.setPriority(record.get(TableAlias.supervisionSupervisor.PRIORITY));
        model.setRowCreatedTime(record.get(TableAlias.supervisionSupervisor.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.supervisionSupervisor.ROW_UPDATED_TIME));
        return model;
    }
}
