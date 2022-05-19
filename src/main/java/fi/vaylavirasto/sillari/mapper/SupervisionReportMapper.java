package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.SupervisionReportModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionReportMapper implements RecordMapper<Record, SupervisionReportModel> {
    @Nullable
    @Override
    public SupervisionReportModel map(Record record) {
        SupervisionReportModel model = new SupervisionReportModel();
        model.setId(record.get(TableAlias.supervisionReport.ID));
        model.setSupervisionId(record.get(TableAlias.supervisionReport.SUPERVISION_ID));
        model.setDrivingLineOk(record.get(TableAlias.supervisionReport.DRIVING_LINE_OK));
        model.setDrivingLineInfo(record.get(TableAlias.supervisionReport.DRIVING_LINE_INFO));
        model.setSpeedLimitOk(record.get(TableAlias.supervisionReport.SPEED_LIMIT_OK));
        model.setSpeedLimitInfo(record.get(TableAlias.supervisionReport.SPEED_LIMIT_INFO));
        model.setAnomalies(record.get(TableAlias.supervisionReport.ANOMALIES));
        model.setAnomaliesDescription(record.get(TableAlias.supervisionReport.ANOMALIES_DESCRIPTION));
        model.setSurfaceDamage(record.get(TableAlias.supervisionReport.SURFACE_DAMAGE));
        model.setJointDamage(record.get(TableAlias.supervisionReport.JOINT_DAMAGE));
        model.setBendOrDisplacement(record.get(TableAlias.supervisionReport.BEND_OR_DISPLACEMENT));
        model.setOtherObservations(record.get(TableAlias.supervisionReport.OTHER_OBSERVATIONS));
        model.setOtherObservationsInfo(record.get(TableAlias.supervisionReport.OTHER_OBSERVATIONS_INFO));
        model.setAdditionalInfo(record.get(TableAlias.supervisionReport.ADDITIONAL_INFO));
        model.setDraft(record.get(TableAlias.supervisionReport.DRAFT));
        model.setPdfObjectKey(record.get(TableAlias.supervisionReport.PDF_OBJECT_KEY));
        model.setPdfKtvObjectId(record.get(TableAlias.supervisionReport.PDF_KTV_OBJECT_ID));
        model.setRowCreatedTime(record.get(TableAlias.supervisionReport.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.supervisionReport.ROW_UPDATED_TIME));
        return model;
    }
}
