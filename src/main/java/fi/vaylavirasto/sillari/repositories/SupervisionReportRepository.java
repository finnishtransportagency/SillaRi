package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.SupervisionReportMapper;
import fi.vaylavirasto.sillari.model.SupervisionReportModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class SupervisionReportRepository {
    @Autowired
    private DSLContext dsl;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;

    public SupervisionReportModel getSupervisionReport(Integer supervisionId) {
        return dsl.selectFrom(TableAlias.supervisionReport)
                .where(TableAlias.supervisionReport.SUPERVISION_ID.eq(supervisionId))
                .fetchOne(new SupervisionReportMapper());
    }

    public Integer createSupervisionReport(SupervisionReportModel report) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);
            Integer supervisionId = report.getSupervisionId();

            // Check first that report does not already exist (can't trust frontend completely)
            Record1<Integer> supervisionReportIdResult = ctx.select(TableAlias.supervisionReport.ID).from(TableAlias.supervisionReport)
                    .where(TableAlias.supervisionReport.SUPERVISION_ID.eq(supervisionId)).fetchAny();

            if (supervisionReportIdResult == null) {
                ctx.insertInto(TableAlias.supervisionReport,
                                TableAlias.supervisionReport.SUPERVISION_ID,
                                TableAlias.supervisionReport.DRIVING_LINE_OK,
                                TableAlias.supervisionReport.DRIVING_LINE_INFO,
                                TableAlias.supervisionReport.SPEED_LIMIT_OK,
                                TableAlias.supervisionReport.SPEED_LIMIT_INFO,
                                TableAlias.supervisionReport.ANOMALIES,
                                TableAlias.supervisionReport.ANOMALIES_DESCRIPTION,
                                TableAlias.supervisionReport.SURFACE_DAMAGE,
                                TableAlias.supervisionReport.JOINT_DAMAGE,
                                TableAlias.supervisionReport.BEND_OR_DISPLACEMENT,
                                TableAlias.supervisionReport.OTHER_OBSERVATIONS,
                                TableAlias.supervisionReport.OTHER_OBSERVATIONS_INFO,
                                TableAlias.supervisionReport.ADDITIONAL_INFO,
                                TableAlias.supervisionReport.DRAFT
                        ).values(
                                supervisionId,
                                report.getDrivingLineOk(),
                                report.getDrivingLineInfo(),
                                report.getSpeedLimitOk(),
                                report.getSpeedLimitInfo(),
                                report.getAnomalies(),
                                report.getAnomaliesDescription(),
                                report.getSurfaceDamage(),
                                report.getJointDamage(),
                                report.getBendOrDisplacement(),
                                report.getOtherObservations(),
                                report.getOtherObservationsInfo(),
                                report.getAdditionalInfo(),
                                report.getDraft()
                        )
                        .returningResult(TableAlias.supervisionReport.ID)
                        .fetchOne(); // Execute and return zero or one record
            }

            return supervisionReportIdResult != null ? supervisionReportIdResult.value1() : null;
        });
    }

    public void updateSupervisionReport(SupervisionReportModel supervisionReport) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            // Update using the supervision id so that this works if the report was created while the UI was offline
            // In this case when coming online, the report id is -1 in both startSupervision and updateSupervisionReport
            ctx.update(TableAlias.supervisionReport)
                    .set(TableAlias.supervisionReport.DRIVING_LINE_OK, supervisionReport.getDrivingLineOk())
                    .set(TableAlias.supervisionReport.DRIVING_LINE_INFO, supervisionReport.getDrivingLineInfo())
                    .set(TableAlias.supervisionReport.SPEED_LIMIT_OK, supervisionReport.getSpeedLimitOk())
                    .set(TableAlias.supervisionReport.SPEED_LIMIT_INFO, supervisionReport.getSpeedLimitInfo())
                    .set(TableAlias.supervisionReport.ANOMALIES, supervisionReport.getAnomalies())
                    .set(TableAlias.supervisionReport.ANOMALIES_DESCRIPTION, supervisionReport.getAnomaliesDescription())
                    .set(TableAlias.supervisionReport.SURFACE_DAMAGE, supervisionReport.getSurfaceDamage())
                    .set(TableAlias.supervisionReport.JOINT_DAMAGE, supervisionReport.getJointDamage())
                    .set(TableAlias.supervisionReport.BEND_OR_DISPLACEMENT, supervisionReport.getBendOrDisplacement())
                    .set(TableAlias.supervisionReport.OTHER_OBSERVATIONS, supervisionReport.getOtherObservations())
                    .set(TableAlias.supervisionReport.OTHER_OBSERVATIONS_INFO, supervisionReport.getOtherObservationsInfo())
                    .set(TableAlias.supervisionReport.ADDITIONAL_INFO, supervisionReport.getAdditionalInfo())
                    .set(TableAlias.supervisionReport.DRAFT, supervisionReport.getDraft())
                    // .where(TableAlias.supervisionReport.ID.eq(supervisionReport.getId()))
                    .where(TableAlias.supervisionReport.SUPERVISION_ID.eq(supervisionReport.getSupervisionId()))
                    .execute();
        });
    }

    public void deleteSupervisionReport(Integer supervisionId) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.delete(TableAlias.supervisionReport)
                    .where(TableAlias.supervisionReport.SUPERVISION_ID.eq(supervisionId))
                    .execute();
        });
    }

}
