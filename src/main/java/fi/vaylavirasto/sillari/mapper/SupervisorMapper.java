package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.SupervisorModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisorMapper implements RecordMapper<Record, SupervisorModel> {
    @Nullable
    @Override
    public SupervisorModel map(Record record) {
        SupervisorModel model = new SupervisorModel();
        model.setId(record.get(TableAlias.supervisor.ID));
        model.setFirstName(record.get(TableAlias.supervisor.FIRSTNAME));
        model.setLastName(record.get(TableAlias.supervisor.LASTNAME));
        model.setUsername(record.get(TableAlias.supervisor.USERNAME));
        model.setRowCreatedTime(record.get(TableAlias.supervisor.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.supervisor.ROW_UPDATED_TIME));
        return model;
    }
}
