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
        SupervisorModel supervisorModel = new SupervisorModel();
        supervisorModel.setId(record.get(TableAlias.supervisor.ID));
        supervisorModel.setFirstName(record.get(TableAlias.supervisor.FIRSTNAME));
        supervisorModel.setLastName(record.get(TableAlias.supervisor.LASTNAME));
        supervisorModel.setUsername(record.get(TableAlias.supervisor.USERNAME));
        return supervisorModel;
    }
}
