package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.SupervisionMapper;
import fi.vaylavirasto.sillari.model.SupervisionModel;
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

import java.time.OffsetDateTime;

@Repository
public class SupervisionRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public SupervisionModel getSupervisionById(Integer id) {
        return dsl.select().from(SupervisionMapper.supervision)
                .leftJoin(SupervisionMapper.supervisionStatus)
                .on(SupervisionMapper.supervision.ID.eq(SupervisionMapper.supervisionStatus.SUPERVISION_ID))
                .leftJoin(SupervisionMapper.supervisionReport)
                .on(SupervisionMapper.supervision.ID.eq(SupervisionMapper.supervisionReport.SUPERVISION_ID))
                .where(SupervisionMapper.supervision.ID.eq(id))
                .orderBy(SupervisionMapper.supervisionStatus.TIME.desc())
                .limit(1).fetchOne(new SupervisionMapper());
    }

    public SupervisionModel getSupervisionByRouteBridgeId(Integer routeBridgeId) {
        return dsl.select().from(SupervisionMapper.supervision)
                .leftJoin(SupervisionMapper.supervisionStatus)
                .on(SupervisionMapper.supervision.ID.eq(SupervisionMapper.supervisionStatus.SUPERVISION_ID))
                .leftJoin(SupervisionMapper.supervisionReport)
                .on(SupervisionMapper.supervision.ID.eq(SupervisionMapper.supervisionReport.SUPERVISION_ID))
                .where(SupervisionMapper.supervision.ROUTE_BRIDGE_ID.eq(routeBridgeId))
                .orderBy(SupervisionMapper.supervisionStatus.TIME.desc())
                .limit(1).fetchOne(new SupervisionMapper());
    }

    public Integer createSupervision(SupervisionModel supervisionModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> supervisionIdResult = ctx.insertInto(SupervisionMapper.supervision,
                            SupervisionMapper.supervision.ROUTE_BRIDGE_ID,
                            SupervisionMapper.supervision.ROUTE_TRANSPORT_ID,
                            SupervisionMapper.supervision.SUPERVISOR_ID,
                            SupervisionMapper.supervision.PLANNED_TIME,
                            SupervisionMapper.supervision.CONFORMS_TO_PERMIT
                    ).values(
                            supervisionModel.getRouteBridgeId(),
                            supervisionModel.getRouteTransportId(),
                            supervisionModel.getSupervisorId(),
                            supervisionModel.getPlannedTime(),
                            false)
                    .returningResult(SupervisionMapper.supervision.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer supervisionId = supervisionIdResult != null ? supervisionIdResult.value1() : null;
            supervisionModel.setId(supervisionId);

            insertSupervisionStatus(ctx, supervisionId, SupervisionStatusType.PLANNED);

            return supervisionId;
        });
    }

    private void insertSupervisionStatus(DSLContext ctx, Integer supervisionId, SupervisionStatusType statusType) {
        ctx.insertInto(SupervisionMapper.supervisionStatus,
                        SupervisionMapper.supervisionStatus.SUPERVISION_ID,
                        SupervisionMapper.supervisionStatus.STATUS,
                        SupervisionMapper.supervisionStatus.TIME
                ).values(
                        supervisionId,
                        String.valueOf(statusType),
                        OffsetDateTime.now())
                .execute();
    }

    public void updateSupervision(SupervisionModel supervisionModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(SupervisionMapper.supervision)
                    .set(SupervisionMapper.supervision.ROUTE_TRANSPORT_ID, supervisionModel.getRouteTransportId())
                    .set(SupervisionMapper.supervision.SUPERVISOR_ID, supervisionModel.getSupervisorId())
                    .set(SupervisionMapper.supervision.PLANNED_TIME, supervisionModel.getPlannedTime())
                    .where(SupervisionMapper.supervision.ID.eq(supervisionModel.getId()))
                    .execute();
        });
    }

    public Integer createSupervisionReport(SupervisionModel supervisionModel) throws DataAccessException {
        Integer supervisionId = supervisionModel.getId();

        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> supervisionReportIdResult = ctx.insertInto(SupervisionMapper.supervisionReport,
                            SupervisionMapper.supervisionReport.SUPERVISION_ID,
                            SupervisionMapper.supervisionReport.DRIVING_LINE_OK,
                            SupervisionMapper.supervisionReport.DRIVING_LINE_INFO,
                            SupervisionMapper.supervisionReport.SPEED_LIMIT_OK,
                            SupervisionMapper.supervisionReport.SPEED_LIMIT_INFO,
                            SupervisionMapper.supervisionReport.ANOMALIES,
                            SupervisionMapper.supervisionReport.ANOMALIES_DESCRIPTION,
                            SupervisionMapper.supervisionReport.SURFACE_DAMAGE,
                            SupervisionMapper.supervisionReport.SEAM_DAMAGE,
                            SupervisionMapper.supervisionReport.BENDS_DISPLACEMENTS,
                            SupervisionMapper.supervisionReport.OTHER_OBSERVATIONS,
                            SupervisionMapper.supervisionReport.OTHER_OBSERVATIONS_INFO,
                            SupervisionMapper.supervisionReport.ADDITIONAL_INFO,
                            SupervisionMapper.supervisionReport.DRAFT
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
                    .returningResult(SupervisionMapper.supervisionReport.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer supervisionReportId = supervisionReportIdResult != null ? supervisionReportIdResult.value1() : null;

            insertSupervisionStatus(ctx, supervisionReportId, SupervisionStatusType.IN_PROGRESS);

            return supervisionReportId;
        });
    }

    public void updateSupervisionReport(SupervisionModel supervisionModel) {
        SupervisionReportModel supervisionReport = supervisionModel.getReport();

        if (supervisionReport != null) {
            dsl.transaction(configuration -> {
                DSLContext ctx = DSL.using(configuration);

                ctx.update(SupervisionMapper.supervisionReport)
                        .set(SupervisionMapper.supervisionReport.DRIVING_LINE_OK, supervisionReport.getDrivingLineOk())
                        .set(SupervisionMapper.supervisionReport.DRIVING_LINE_INFO, supervisionReport.getDrivingLineInfo())
                        .set(SupervisionMapper.supervisionReport.SPEED_LIMIT_OK, supervisionReport.getSpeedLimitOk())
                        .set(SupervisionMapper.supervisionReport.SPEED_LIMIT_INFO, supervisionReport.getSpeedLimitInfo())
                        .set(SupervisionMapper.supervisionReport.ANOMALIES, supervisionReport.getAnomalies())
                        .set(SupervisionMapper.supervisionReport.ANOMALIES_DESCRIPTION, supervisionReport.getAnomaliesDescription())
                        .set(SupervisionMapper.supervisionReport.SURFACE_DAMAGE, supervisionReport.getSurfaceDamage())
                        .set(SupervisionMapper.supervisionReport.SEAM_DAMAGE, supervisionReport.getSeamDamage())
                        .set(SupervisionMapper.supervisionReport.BENDS_DISPLACEMENTS, supervisionReport.getBendsDisplacements())
                        .set(SupervisionMapper.supervisionReport.OTHER_OBSERVATIONS, supervisionReport.getOtherObservations())
                        .set(SupervisionMapper.supervisionReport.OTHER_OBSERVATIONS_INFO, supervisionReport.getOtherObservationsInfo())
                        .set(SupervisionMapper.supervisionReport.ADDITIONAL_INFO, supervisionReport.getAdditionalInfo())
                        .set(SupervisionMapper.supervisionReport.DRAFT, supervisionReport.getDraft())
                        .where(SupervisionMapper.supervisionReport.ID.eq(supervisionReport.getId()))
                        .execute();
            });
        }
    }

    public void cancelSupervision(SupervisionModel supervisionModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);
            insertSupervisionStatus(ctx, supervisionModel.getId(), SupervisionStatusType.CANCELLED);
        });
    }

    public void finishSupervision(SupervisionModel supervisionModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);
            insertSupervisionStatus(ctx, supervisionModel.getId(), SupervisionStatusType.FINISHED);
        });
    }

}
