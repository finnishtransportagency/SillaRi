package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.SupervisionSupervisor;
import fi.vaylavirasto.sillari.model.tables.Supervisor;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisorMapper implements RecordMapper<Record, SupervisorModel> {
    public static final Supervisor supervisor = Tables.SUPERVISOR.as("sr");
    public static final SupervisionSupervisor supervisionSupervisor = Tables.SUPERVISION_SUPERVISOR.as("ss");

    @Nullable
    @Override
    public SupervisorModel map(Record record) {
        SupervisorModel supervisorModel = new SupervisorModel();
        supervisorModel.setId(record.get(supervisor.ID));
        supervisorModel.setFirstName(record.get(supervisor.FIRSTNAME));
        supervisorModel.setLastName(record.get(supervisor.LASTNAME));
        supervisorModel.setPriority(record.get(supervisionSupervisor.PRIORITY));
        return supervisorModel;
    }
}
