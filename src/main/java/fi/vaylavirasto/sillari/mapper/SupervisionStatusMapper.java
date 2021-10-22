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
        SupervisionStatusModel supervisionStatusModel = new SupervisionStatusModel();
        supervisionStatusModel.setId(record.get(TableAlias.supervisionStatus.ID));
        supervisionStatusModel.setSupervisionId(record.get(TableAlias.supervisionStatus.SUPERVISION_ID));
        supervisionStatusModel.setStatus(record.get(TableAlias.supervisionStatus.STATUS, new SupervisionStatusTypeConverter(String.class, SupervisionStatusType.class)));
        supervisionStatusModel.setTime(record.get(TableAlias.supervisionStatus.TIME));
        return supervisionStatusModel;
    }
}
