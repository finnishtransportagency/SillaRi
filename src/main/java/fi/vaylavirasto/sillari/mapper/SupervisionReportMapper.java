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
        SupervisionReportModel supervisionReportModel = new SupervisionReportModel();
        supervisionReportModel.setId(record.get(TableAlias.supervisionReport.ID));
        supervisionReportModel.setSupervisionId(record.get(TableAlias.supervisionReport.SUPERVISION_ID));
        supervisionReportModel.setDrivingLineOk(record.get(TableAlias.supervisionReport.DRIVING_LINE_OK));
        supervisionReportModel.setDrivingLineInfo(record.get(TableAlias.supervisionReport.DRIVING_LINE_INFO));
        supervisionReportModel.setSpeedLimitOk(record.get(TableAlias.supervisionReport.SPEED_LIMIT_OK));
        supervisionReportModel.setSpeedLimitInfo(record.get(TableAlias.supervisionReport.SPEED_LIMIT_INFO));
        supervisionReportModel.setAnomalies(record.get(TableAlias.supervisionReport.ANOMALIES));
        supervisionReportModel.setAnomaliesDescription(record.get(TableAlias.supervisionReport.ANOMALIES_DESCRIPTION));
        supervisionReportModel.setSurfaceDamage(record.get(TableAlias.supervisionReport.SURFACE_DAMAGE));
        supervisionReportModel.setJointDamage(record.get(TableAlias.supervisionReport.JOINT_DAMAGE));
        supervisionReportModel.setBendOrDisplacement(record.get(TableAlias.supervisionReport.BEND_OR_DISPLACEMENT));
        supervisionReportModel.setOtherObservations(record.get(TableAlias.supervisionReport.OTHER_OBSERVATIONS));
        supervisionReportModel.setOtherObservationsInfo(record.get(TableAlias.supervisionReport.OTHER_OBSERVATIONS_INFO));
        supervisionReportModel.setAdditionalInfo(record.get(TableAlias.supervisionReport.ADDITIONAL_INFO));
        supervisionReportModel.setDraft(record.get(TableAlias.supervisionReport.DRAFT));
        return supervisionReportModel;
    }
}
