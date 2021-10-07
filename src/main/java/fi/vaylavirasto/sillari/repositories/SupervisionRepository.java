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
import java.util.List;

@Repository
public class SupervisionRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;
    @Autowired
    SupervisorRepository supervisorRepository;

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

    public List<SupervisionModel> getSupervisionsByRouteTransportId(Integer routeTransportId) {
        return dsl.select().from(SupervisionMapper.supervision)
                .leftJoin(SupervisionMapper.supervisionStatus)
                .on(SupervisionMapper.supervision.ID.eq(SupervisionMapper.supervisionStatus.SUPERVISION_ID))
                .leftJoin(SupervisionMapper.supervisionReport)
                .on(SupervisionMapper.supervision.ID.eq(SupervisionMapper.supervisionReport.SUPERVISION_ID))
                .where(SupervisionMapper.supervision.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .orderBy(SupervisionMapper.supervisionStatus.TIME.desc())
                .fetch(new SupervisionMapper());
    }

    public Integer createSupervision(SupervisionModel supervisionModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> supervisionIdResult = ctx.insertInto(SupervisionMapper.supervision,
                            SupervisionMapper.supervision.ROUTE_BRIDGE_ID,
                            SupervisionMapper.supervision.ROUTE_TRANSPORT_ID,
                            SupervisionMapper.supervision.PLANNED_TIME,
                            SupervisionMapper.supervision.SUPERVISOR_TYPE,
                            SupervisionMapper.supervision.CONFORMS_TO_PERMIT
                    ).values(
                            supervisionModel.getRouteBridgeId(),
                            supervisionModel.getRouteTransportId(),
                            supervisionModel.getPlannedTime(),
                            supervisionModel.getSupervisorType().toString(),
                            false)
                    .returningResult(SupervisionMapper.supervision.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer supervisionId = supervisionIdResult != null ? supervisionIdResult.value1() : null;
            supervisionModel.setId(supervisionId);

            insertSupervisionStatus(ctx, supervisionId, SupervisionStatusType.PLANNED);

            supervisionModel.getSupervisors().forEach(supervisorModel -> {
                supervisorRepository.insertSupervisionSupervisor(ctx, supervisionId, supervisorModel.getId(), supervisorModel.getPriority());
            });

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
                    .set(SupervisionMapper.supervision.PLANNED_TIME, supervisionModel.getPlannedTime())
                    .set(SupervisionMapper.supervision.CONFORMS_TO_PERMIT, supervisionModel.getConformsToPermit())
                    .set(SupervisionMapper.supervision.SUPERVISOR_TYPE, supervisionModel.getSupervisorType().toString())
                    .where(SupervisionMapper.supervision.ID.eq(supervisionModel.getId()))
                    .execute();

            supervisorRepository.deleteSupervisionSupervisors(ctx, supervisionModel.getId());
            supervisionModel.getSupervisors().forEach(supervisorModel -> {
                supervisorRepository.insertSupervisionSupervisor(ctx, supervisionModel.getId(), supervisorModel.getId(), supervisorModel.getPriority());
            });
        });
    }

    public Integer createSupervisionReport(Integer supervisionId) throws DataAccessException {
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
                            SupervisionMapper.supervisionReport.JOINT_DAMAGE,
                            SupervisionMapper.supervisionReport.BEND_OR_DISPLACEMENT,
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

            insertSupervisionStatus(ctx, supervisionId, SupervisionStatusType.IN_PROGRESS);

            return supervisionReportId;
        });
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

    public void updateSupervisionReport(SupervisionReportModel supervisionReport) {
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
                    .set(SupervisionMapper.supervisionReport.JOINT_DAMAGE, supervisionReport.getJointDamage())
                    .set(SupervisionMapper.supervisionReport.BEND_OR_DISPLACEMENT, supervisionReport.getBendOrDisplacement())
                    .set(SupervisionMapper.supervisionReport.OTHER_OBSERVATIONS, supervisionReport.getOtherObservations())
                    .set(SupervisionMapper.supervisionReport.OTHER_OBSERVATIONS_INFO, supervisionReport.getOtherObservationsInfo())
                    .set(SupervisionMapper.supervisionReport.ADDITIONAL_INFO, supervisionReport.getAdditionalInfo())
                    .set(SupervisionMapper.supervisionReport.DRAFT, supervisionReport.getDraft())
                    .where(SupervisionMapper.supervisionReport.ID.eq(supervisionReport.getId()))
                    .execute();
        });
    }

}
