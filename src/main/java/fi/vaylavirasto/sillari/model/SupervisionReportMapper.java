package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.SupervisionReport;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SupervisionReportMapper implements RecordMapper<Record, SupervisionReportModel> {
    public static final SupervisionReport supervisionReport = Tables.SUPERVISION_REPORT.as("snr");

    @Nullable
    @Override
    public SupervisionReportModel map(Record record) {
        SupervisionReportModel supervisionReportModel = new SupervisionReportModel();
        supervisionReportModel.setId(record.get(supervisionReport.ID));
        supervisionReportModel.setSupervisionId(record.get(supervisionReport.SUPERVISION_ID));
        supervisionReportModel.setDrivingLineOk(record.get(supervisionReport.DRIVING_LINE_OK));
        supervisionReportModel.setDrivingLineInfo(record.get(supervisionReport.DRIVING_LINE_INFO));
        supervisionReportModel.setSpeedLimitOk(record.get(supervisionReport.SPEED_LIMIT_OK));
        supervisionReportModel.setSpeedLimitInfo(record.get(supervisionReport.SPEED_LIMIT_INFO));
        supervisionReportModel.setAnomalies(record.get(supervisionReport.ANOMALIES));
        supervisionReportModel.setAnomaliesDescription(record.get(supervisionReport.ANOMALIES_DESCRIPTION));
        supervisionReportModel.setSurfaceDamage(record.get(supervisionReport.SURFACE_DAMAGE));
        supervisionReportModel.setJointDamage(record.get(supervisionReport.JOINT_DAMAGE));
        supervisionReportModel.setBendOrDisplacement(record.get(supervisionReport.BEND_OR_DISPLACEMENT));
        supervisionReportModel.setOtherObservations(record.get(supervisionReport.OTHER_OBSERVATIONS));
        supervisionReportModel.setOtherObservationsInfo(record.get(supervisionReport.OTHER_OBSERVATIONS_INFO));
        supervisionReportModel.setAdditionalInfo(record.get(supervisionReport.ADDITIONAL_INFO));
        supervisionReportModel.setDraft(record.get(supervisionReport.DRAFT));
        return supervisionReportModel;
    }
}
