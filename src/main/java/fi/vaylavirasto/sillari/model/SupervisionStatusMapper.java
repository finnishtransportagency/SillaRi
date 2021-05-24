package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.SupervisionStatus;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionStatusMapper implements RecordMapper<Record, SupervisionStatusModel> {
    public static final SupervisionStatus supervisionStatus = Tables.SUPERVISION_STATUS.as("ss");

    @Nullable
    @Override
    public SupervisionStatusModel map(Record record) {
        SupervisionStatusModel supervisionStatusModel = new SupervisionStatusModel();
        supervisionStatusModel.setId(record.get(supervisionStatus.ID));
        supervisionStatusModel.setSupervisionId(record.get(supervisionStatus.SUPERVISION_ID));
        supervisionStatusModel.setStatus(record.get(supervisionStatus.STATUS, new SupervisionStatusTypeConverter(String.class, SupervisionStatusType.class)));
        supervisionStatusModel.setTime(record.get(supervisionStatus.TIME));
        return supervisionStatusModel;
    }
}
