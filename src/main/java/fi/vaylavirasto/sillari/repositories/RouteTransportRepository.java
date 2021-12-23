package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.RouteTransportMapper;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import fi.vaylavirasto.sillari.model.TransportStatusType;
import fi.vaylavirasto.sillari.util.TableAlias;
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

import static org.jooq.impl.DSL.notExists;
import static org.jooq.impl.DSL.selectOne;

@Repository
public class RouteTransportRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;
    @Autowired
    RouteTransportStatusRepository routeTransportStatusRepository;
    @Autowired
    RouteTransportPasswordRepository routeTransportPasswordRepository;
    @Autowired
    PermitRepository permitRepository;

    public RouteTransportModel getRouteTransportById(Integer id) {
        return dsl.select().from(TableAlias.routeTransport)
                .where(TableAlias.routeTransport.ID.eq(id))
                .fetchOne(new RouteTransportMapper());
    }

    public List<RouteTransportModel> getRouteTransportsByPermitId(Integer permitId) {
        return dsl.select().from(TableAlias.routeTransport)
                .innerJoin(TableAlias.route)
                .on(TableAlias.route.ID.eq(TableAlias.routeTransport.ROUTE_ID))
                .innerJoin(TableAlias.permit)
                .on(TableAlias.permit.ID.eq(TableAlias.route.PERMIT_ID))
                .where(TableAlias.permit.ID.eq(permitId))
                .fetch(new RouteTransportMapper());
    }

    public List<RouteTransportModel> getRouteTransportsOfSupervisor(String username) {
        return dsl.select(TableAlias.routeTransport.ID, TableAlias.routeTransport.ROUTE_ID, TableAlias.routeTransport.PLANNED_DEPARTURE_TIME, TableAlias.routeTransport.TRACTOR_UNIT)
                .from(TableAlias.routeTransport)
                .innerJoin(TableAlias.supervision).on(TableAlias.routeTransport.ID.eq(TableAlias.supervision.ROUTE_TRANSPORT_ID))
                .innerJoin(TableAlias.supervisionSupervisor).on(TableAlias.supervision.ID.eq(TableAlias.supervisionSupervisor.SUPERVISION_ID))
                .where(TableAlias.supervisionSupervisor.USERNAME.eq(username))
                // Filter routeTransports with only completed supervisions
                .and(notExists(selectOne().from(TableAlias.supervisionStatus
                        .where(TableAlias.supervisionStatus.SUPERVISION_ID.eq(TableAlias.supervision.ID)
                                .and((TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.FINISHED.toString()))
                                        .or(TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.CROSSING_DENIED.toString()))
                                        .or(TableAlias.supervisionStatus.STATUS.eq(SupervisionStatusType.REPORT_SIGNED.toString())))))))
                .groupBy(TableAlias.routeTransport.ID, TableAlias.routeTransport.ROUTE_ID, TableAlias.routeTransport.PLANNED_DEPARTURE_TIME, TableAlias.routeTransport.TRACTOR_UNIT)
                .fetch(new RouteTransportMapper());
    }

    public Integer createRouteTransport(RouteTransportModel routeTransportModel, String password) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> routeTransportIdResult = ctx.insertInto(TableAlias.routeTransport,
                            TableAlias.routeTransport.ROUTE_ID,
                            TableAlias.routeTransport.PLANNED_DEPARTURE_TIME,
                            TableAlias.routeTransport.TRACTOR_UNIT
                    ).values(
                            routeTransportModel.getRouteId(),
                            routeTransportModel.getPlannedDepartureTime(),
                            routeTransportModel.getTractorUnit()
                    )
                    .returningResult(TableAlias.routeTransport.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer routeTransportId = routeTransportIdResult != null ? routeTransportIdResult.value1() : null;
            routeTransportModel.setId(routeTransportId);

            if (routeTransportId != null) {
                routeTransportStatusRepository.insertTransportStatus(ctx, routeTransportId, TransportStatusType.PLANNED);

                OffsetDateTime passwordExpiryDate = permitRepository.getPermitValidEndDateByRouteTransportId(ctx, routeTransportId);

                if (password != null && password.length() > 0 && passwordExpiryDate != null) {
                    routeTransportPasswordRepository.insertTransportPassword(ctx, routeTransportId, password, passwordExpiryDate);
                }
            }

            return routeTransportId;
        });
    }

    public void updateRouteTransport(RouteTransportModel routeTransportModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.routeTransport)
                    .set(TableAlias.routeTransport.ROUTE_ID, routeTransportModel.getRouteId())
                    .set(TableAlias.routeTransport.PLANNED_DEPARTURE_TIME, routeTransportModel.getPlannedDepartureTime())
                    .set(TableAlias.routeTransport.TRACTOR_UNIT, routeTransportModel.getTractorUnit())
                    .where(TableAlias.routeTransport.ID.eq(routeTransportModel.getId()))
                    .execute();

            OffsetDateTime passwordExpiryDate = permitRepository.getPermitValidEndDateByRouteTransportId(ctx, routeTransportModel.getId());

            if (passwordExpiryDate != null) {
                routeTransportPasswordRepository.updateTransportPasswordExpiry(ctx, routeTransportModel.getId(), passwordExpiryDate);
            }
        });
    }

    public void updateRouteTransportAndInsertPassword(RouteTransportModel routeTransportModel, String password) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.routeTransport)
                    .set(TableAlias.routeTransport.ROUTE_ID, routeTransportModel.getRouteId())
                    .set(TableAlias.routeTransport.PLANNED_DEPARTURE_TIME, routeTransportModel.getPlannedDepartureTime())
                    .set(TableAlias.routeTransport.TRACTOR_UNIT, routeTransportModel.getTractorUnit())
                    .where(TableAlias.routeTransport.ID.eq(routeTransportModel.getId()))
                    .execute();

            OffsetDateTime passwordExpiryDate = permitRepository.getPermitValidEndDateByRouteTransportId(ctx, routeTransportModel.getId());

            if (password != null && password.length() > 0 && passwordExpiryDate != null) {
                routeTransportPasswordRepository.insertTransportPassword(ctx, routeTransportModel.getId(), password, passwordExpiryDate);
            }
        });
    }

    public void deleteRouteTransport(RouteTransportModel routeTransportModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            routeTransportStatusRepository.deleteSupervisionStatuses(ctx, routeTransportModel.getId());
            routeTransportPasswordRepository.deleteTransportPasswords(ctx, routeTransportModel.getId());

            ctx.delete(TableAlias.routeTransport)
                    .where(TableAlias.routeTransport.ID.eq(routeTransportModel.getId()))
                    .execute();
        });
    }
}
