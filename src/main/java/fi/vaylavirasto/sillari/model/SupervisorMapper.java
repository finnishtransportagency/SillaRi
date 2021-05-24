package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Supervisor;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class SupervisorMapper implements RecordMapper<Record, SupervisorModel> {
    public static final Supervisor supervisor = Tables.SUPERVISOR.as("s");

    @Nullable
    @Override
    public SupervisorModel map(Record record) {
        SupervisorModel supervisorModel = new SupervisorModel();
        supervisorModel.setId(record.get(supervisor.ID));
        supervisorModel.setFirstName(record.get(supervisor.FIRSTNAME));
        supervisorModel.setLastName(record.get(supervisor.LASTNAME));
        supervisorModel.setSupervisions(new ArrayList<>());
        return supervisorModel;
    }


}
