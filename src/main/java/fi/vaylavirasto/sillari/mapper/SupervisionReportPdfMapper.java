package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.ReportPdfStatusType;
import fi.vaylavirasto.sillari.model.ReportPdfStatusTypeConverter;
import fi.vaylavirasto.sillari.model.SupervisionReportPdfModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionReportPdfMapper implements RecordMapper<Record, SupervisionReportPdfModel> {
    @Nullable
    @Override
    public SupervisionReportPdfModel map(Record record) {
        SupervisionReportPdfModel model = new SupervisionReportPdfModel();
        model.setId(record.get(TableAlias.supervisionReportPdf.ID));
        model.setSupervisionReportId(record.get(TableAlias.supervisionReportPdf.SUPERVISION_REPORT_ID));
        model.setFilename(record.get(TableAlias.supervisionReportPdf.FILENAME));
        model.setObjectKey(record.get(TableAlias.supervisionReportPdf.OBJECT_KEY));
        model.setKtvObjectId(record.get(TableAlias.supervisionReportPdf.KTV_OBJECT_ID));
        model.setStatus(record.get(TableAlias.supervisionReportPdf.STATUS, new ReportPdfStatusTypeConverter(String.class, ReportPdfStatusType.class)));
        model.setStatusTime(record.get(TableAlias.supervisionReportPdf.STATUS_TIME));
        model.setRowCreatedTime(record.get(TableAlias.supervisionReportPdf.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.supervisionReportPdf.ROW_UPDATED_TIME));
        return model;
    }
}
