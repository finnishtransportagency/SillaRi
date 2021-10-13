package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.SupervisionStatusModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import fi.vaylavirasto.sillari.model.SupervisionStatusTypeConverter;
import fi.vaylavirasto.sillari.model.Tables;
import fi.vaylavirasto.sillari.model.tables.SupervisionStatus;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionStatusMapper implements RecordMapper<Record, SupervisionStatusModel> {
    public static final SupervisionStatus supervisionStatus = Tables.SUPERVISION_STATUS.as("sns");

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
