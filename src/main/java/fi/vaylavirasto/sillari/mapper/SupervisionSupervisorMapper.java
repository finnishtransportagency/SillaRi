package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.SupervisionSupervisorModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionSupervisorMapper implements RecordMapper<Record, SupervisionSupervisorModel> {
    @Nullable
    @Override
    public SupervisionSupervisorModel map(Record record) {
        SupervisionSupervisorModel model = new SupervisionSupervisorModel();
        model.setId(record.get(TableAlias.supervisionSupervisor.ID));
        model.setUsername(record.get(TableAlias.supervisionSupervisor.USERNAME));
        model.setPriority(record.get(TableAlias.supervisionSupervisor.PRIORITY));
        model.setRowCreatedTime(record.get(TableAlias.supervisionSupervisor.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.supervisionSupervisor.ROW_UPDATED_TIME));
        return model;
    }
}
