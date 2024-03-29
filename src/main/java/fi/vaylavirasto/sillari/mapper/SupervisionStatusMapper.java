package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.SupervisionStatusModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import fi.vaylavirasto.sillari.model.SupervisionStatusTypeConverter;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionStatusMapper implements RecordMapper<Record, SupervisionStatusModel> {
    @Nullable
    @Override
    public SupervisionStatusModel map(Record record) {
        SupervisionStatusModel model = new SupervisionStatusModel();
        model.setId(record.get(TableAlias.supervisionStatus.ID));
        model.setSupervisionId(record.get(TableAlias.supervisionStatus.SUPERVISION_ID));
        model.setStatus(record.get(TableAlias.supervisionStatus.STATUS, new SupervisionStatusTypeConverter(String.class, SupervisionStatusType.class)));
        model.setTime(record.get(TableAlias.supervisionStatus.TIME));
        model.setReason(record.get(TableAlias.supervisionStatus.REASON));
        model.setUsername(record.get(TableAlias.supervisionStatus.USERNAME));
        model.setRowCreatedTime(record.get(TableAlias.supervisionStatus.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.supervisionStatus.ROW_UPDATED_TIME));
        return model;
    }
}
