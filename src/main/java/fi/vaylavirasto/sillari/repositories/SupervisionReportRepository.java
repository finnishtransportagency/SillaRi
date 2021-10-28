package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.SupervisionReportMapper;
import fi.vaylavirasto.sillari.model.SupervisionReportModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import fi.vaylavirasto.sillari.util.TableAlias;
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
        return dsl.selectFrom(TableAlias.supervisionReport)
                .where(TableAlias.supervisionReport.SUPERVISION_ID.eq(supervisionId))
                .fetchOne(new SupervisionReportMapper());
    }

    public Integer createSupervisionReport(Integer supervisionId) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            supervisionStatusRepository.insertSupervisionStatus(ctx, supervisionId, SupervisionStatusType.IN_PROGRESS);

            Record1<Integer> supervisionReportIdResult = ctx.insertInto(TableAlias.supervisionReport,
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
                    .returningResult(TableAlias.supervisionReport.ID)
                    .fetchOne(); // Execute and return zero or one record

            return supervisionReportIdResult != null ? supervisionReportIdResult.value1() : null;
        });
    }

    public void updateSupervisionReport(SupervisionReportModel supervisionReport) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

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
                    .where(TableAlias.supervisionReport.ID.eq(supervisionReport.getId()))
                    .execute();
        });
    }

}
