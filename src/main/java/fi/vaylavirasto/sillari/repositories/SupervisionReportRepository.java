package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.SupervisionReportMapper;
import fi.vaylavirasto.sillari.model.SupervisionReportModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class SupervisionReportRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;

    public SupervisionReportModel getSupervisionReport(Integer supervisionId) {
        return dsl.selectFrom(SupervisionReportMapper.supervisionReport)
                .where(SupervisionReportMapper.supervisionReport.SUPERVISION_ID.eq(supervisionId))
                .fetchOne(new SupervisionReportMapper());
    }

    public Integer createSupervisionReport(Integer supervisionId) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            supervisionStatusRepository.insertSupervisionStatus(ctx, supervisionId, SupervisionStatusType.IN_PROGRESS);

            Record1<Integer> supervisionReportIdResult = ctx.insertInto(SupervisionReportMapper.supervisionReport,
                            SupervisionReportMapper.supervisionReport.SUPERVISION_ID,
                            SupervisionReportMapper.supervisionReport.DRIVING_LINE_OK,
                            SupervisionReportMapper.supervisionReport.DRIVING_LINE_INFO,
                            SupervisionReportMapper.supervisionReport.SPEED_LIMIT_OK,
                            SupervisionReportMapper.supervisionReport.SPEED_LIMIT_INFO,
                            SupervisionReportMapper.supervisionReport.ANOMALIES,
                            SupervisionReportMapper.supervisionReport.ANOMALIES_DESCRIPTION,
                            SupervisionReportMapper.supervisionReport.SURFACE_DAMAGE,
                            SupervisionReportMapper.supervisionReport.JOINT_DAMAGE,
                            SupervisionReportMapper.supervisionReport.BEND_OR_DISPLACEMENT,
                            SupervisionReportMapper.supervisionReport.OTHER_OBSERVATIONS,
                            SupervisionReportMapper.supervisionReport.OTHER_OBSERVATIONS_INFO,
                            SupervisionReportMapper.supervisionReport.ADDITIONAL_INFO,
                            SupervisionReportMapper.supervisionReport.DRAFT
                    ).values(
                            supervisionId,
                            true, "", // driving line
                            true, "", // speed limit
                            false, "", // anomalies
                            false, // surface
                            false, // seam
                            false, // bends or displacements
                            false, "", // other observations
                            "", // additional info
                            true // draft
                    )
                    .returningResult(SupervisionReportMapper.supervisionReport.ID)
                    .fetchOne(); // Execute and return zero or one record

            return supervisionReportIdResult != null ? supervisionReportIdResult.value1() : null;
        });
    }

    public void updateSupervisionReport(SupervisionReportModel supervisionReport) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(SupervisionReportMapper.supervisionReport)
                    .set(SupervisionReportMapper.supervisionReport.DRIVING_LINE_OK, supervisionReport.getDrivingLineOk())
                    .set(SupervisionReportMapper.supervisionReport.DRIVING_LINE_INFO, supervisionReport.getDrivingLineInfo())
                    .set(SupervisionReportMapper.supervisionReport.SPEED_LIMIT_OK, supervisionReport.getSpeedLimitOk())
                    .set(SupervisionReportMapper.supervisionReport.SPEED_LIMIT_INFO, supervisionReport.getSpeedLimitInfo())
                    .set(SupervisionReportMapper.supervisionReport.ANOMALIES, supervisionReport.getAnomalies())
                    .set(SupervisionReportMapper.supervisionReport.ANOMALIES_DESCRIPTION, supervisionReport.getAnomaliesDescription())
                    .set(SupervisionReportMapper.supervisionReport.SURFACE_DAMAGE, supervisionReport.getSurfaceDamage())
                    .set(SupervisionReportMapper.supervisionReport.JOINT_DAMAGE, supervisionReport.getJointDamage())
                    .set(SupervisionReportMapper.supervisionReport.BEND_OR_DISPLACEMENT, supervisionReport.getBendOrDisplacement())
                    .set(SupervisionReportMapper.supervisionReport.OTHER_OBSERVATIONS, supervisionReport.getOtherObservations())
                    .set(SupervisionReportMapper.supervisionReport.OTHER_OBSERVATIONS_INFO, supervisionReport.getOtherObservationsInfo())
                    .set(SupervisionReportMapper.supervisionReport.ADDITIONAL_INFO, supervisionReport.getAdditionalInfo())
                    .set(SupervisionReportMapper.supervisionReport.DRAFT, supervisionReport.getDraft())
                    .where(SupervisionReportMapper.supervisionReport.ID.eq(supervisionReport.getId()))
                    .execute();
        });
    }

}
