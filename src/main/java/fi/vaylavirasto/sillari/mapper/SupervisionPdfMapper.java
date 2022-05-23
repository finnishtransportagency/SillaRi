package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.SupervisionPdfStatusType;
import fi.vaylavirasto.sillari.model.SupervisionPdfStatusTypeConverter;
import fi.vaylavirasto.sillari.model.SupervisionPdfModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionPdfMapper implements RecordMapper<Record, SupervisionPdfModel> {
    @Nullable
    @Override
    public SupervisionPdfModel map(Record record) {
        SupervisionPdfModel model = new SupervisionPdfModel();
        model.setId(record.get(TableAlias.supervisionPdf.ID));
        model.setSupervisionId(record.get(TableAlias.supervisionPdf.SUPERVISION_ID));
        model.setFilename(record.get(TableAlias.supervisionPdf.FILENAME));
        model.setObjectKey(record.get(TableAlias.supervisionPdf.OBJECT_KEY));
        model.setKtvObjectId(record.get(TableAlias.supervisionPdf.KTV_OBJECT_ID));
        model.setStatus(record.get(TableAlias.supervisionPdf.STATUS, new SupervisionPdfStatusTypeConverter(String.class, SupervisionPdfStatusType.class)));
        model.setStatusTime(record.get(TableAlias.supervisionPdf.STATUS_TIME));
        model.setRowCreatedTime(record.get(TableAlias.supervisionPdf.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.supervisionPdf.ROW_UPDATED_TIME));
        return model;
    }
}
