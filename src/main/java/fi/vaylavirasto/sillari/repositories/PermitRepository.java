package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PermitRepository {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    private DSLContext dsl;

    public List<PermitModel> getCompanysPermits(Integer companyId) {
        return dsl.select().from(PermitMapper.permit)
                .leftJoin(PermitMapper.axleChart)
                .on(PermitMapper.permit.ID.eq(PermitMapper.axleChart.PERMIT_ID))
                .leftJoin(PermitMapper.transportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.transportDimensions.PERMIT_ID))
                .leftJoin(PermitMapper.unloadedTransportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.unloadedTransportDimensions.PERMIT_ID))
                .where(PermitMapper.permit.COMPANY_ID.eq(companyId))
                .fetch(new PermitMapper());
    }

    public PermitModel getPermit(Integer id) {
        return dsl.select().from(PermitMapper.permit)
                .leftJoin(PermitMapper.axleChart)
                .on(PermitMapper.permit.ID.eq(PermitMapper.axleChart.PERMIT_ID))
                .leftJoin(PermitMapper.transportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.transportDimensions.PERMIT_ID))
                .leftJoin(PermitMapper.unloadedTransportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.unloadedTransportDimensions.PERMIT_ID))
                .where(PermitMapper.permit.ID.eq(id))
                .fetchOne(new PermitMapper());
    }

    public PermitModel getPermitByRouteId(Integer routeId) {
        return dsl.select().from(PermitMapper.permit)
                .join(PermitMapper.route)
                .on(PermitMapper.permit.ID.eq(PermitMapper.route.PERMIT_ID))
                .leftJoin(PermitMapper.axleChart)
                .on(PermitMapper.permit.ID.eq(PermitMapper.axleChart.PERMIT_ID))
                .leftJoin(PermitMapper.transportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.transportDimensions.PERMIT_ID))
                .leftJoin(PermitMapper.unloadedTransportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.unloadedTransportDimensions.PERMIT_ID))
                .where(PermitMapper.route.ID.eq(routeId))
                .fetchOne(new PermitMapper());
    }

    public PermitModel getPermitByRouteBridgeId(Integer routeBridgeId) {
        return dsl.select().from(PermitMapper.permit)
                .join(PermitMapper.route)
                .on(PermitMapper.permit.ID.eq(PermitMapper.route.PERMIT_ID))
                .join(PermitMapper.routeBridge)
                .on(PermitMapper.route.ID.eq(PermitMapper.routeBridge.ROUTE_ID))
                .leftJoin(PermitMapper.axleChart)
                .on(PermitMapper.permit.ID.eq(PermitMapper.axleChart.PERMIT_ID))
                .leftJoin(PermitMapper.transportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.transportDimensions.PERMIT_ID))
                .leftJoin(PermitMapper.unloadedTransportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.unloadedTransportDimensions.PERMIT_ID))
                .where(PermitMapper.routeBridge.ID.eq(routeBridgeId))
                .fetchOne(new PermitMapper());
    }

    public Integer getPermitIdByPermitNumber(String permitNumber) {
        Record1<Integer> record = dsl.select(PermitMapper.permit.ID).from(PermitMapper.permit)
                .where(PermitMapper.permit.PERMIT_NUMBER.eq(permitNumber))
                .fetchOne();
        return record != null ? record.value1() : null;
    }

    public Integer createPermit(PermitModel permitModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> permitIdResult = ctx.insertInto(PermitMapper.permit,
                    PermitMapper.permit.COMPANY_ID,
                    PermitMapper.permit.PERMIT_NUMBER,
                    PermitMapper.permit.LELU_VERSION,
                    PermitMapper.permit.LELU_LAST_MODIFIED_DATE,
                    PermitMapper.permit.VALID_START_DATE,
                    PermitMapper.permit.VALID_END_DATE,
                    PermitMapper.permit.TRANSPORT_TOTAL_MASS,
                    PermitMapper.permit.ADDITIONAL_DETAILS
            ).values(
                    permitModel.getCompanyId(),
                    permitModel.getPermitNumber(),
                    permitModel.getLeluVersion(),
                    permitModel.getLeluLastModifiedDate(),
                    permitModel.getValidStartDate(),
                    permitModel.getValidEndDate(),
                    permitModel.getTransportTotalMass(),
                    permitModel.getAdditionalDetails())
                    .returningResult(PermitMapper.permit.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer permitId = permitIdResult != null ? permitIdResult.value1() : null;
            permitModel.setId(permitId);

            insertTransportDimensions(ctx, permitModel);
            insertUnloadedTransportDimensions(ctx, permitModel);
            insertVehicles(ctx, permitModel);
            insertAxleChart(ctx, permitModel);

            for (RouteModel routeModel : permitModel.getRoutes()) {
                routeModel.setPermitId(permitModel.getId());
                insertRouteAndRouteBridges(ctx, routeModel);
            }

            return permitId;
        });
    }

    private void insertTransportDimensions(DSLContext ctx, PermitModel permitModel) {
        TransportDimensionsModel transportDimensionsModel = permitModel.getTransportDimensions();
        transportDimensionsModel.setPermitId(permitModel.getId());

        ctx.insertInto(PermitMapper.transportDimensions,
                PermitMapper.transportDimensions.PERMIT_ID,
                PermitMapper.transportDimensions.HEIGHT,
                PermitMapper.transportDimensions.WIDTH,
                PermitMapper.transportDimensions.LENGTH
        ).values(
                transportDimensionsModel.getPermitId(),
                transportDimensionsModel.getHeight(),
                transportDimensionsModel.getWidth(),
                transportDimensionsModel.getLength())
                .execute();
    }

    private void insertUnloadedTransportDimensions(DSLContext ctx, PermitModel permitModel) {
        UnloadedTransportDimensionsModel unloadedTransportDimensionsModel = permitModel.getUnloadedTransportDimensions();
        unloadedTransportDimensionsModel.setPermitId(permitModel.getId());

        ctx.insertInto(PermitMapper.unloadedTransportDimensions,
                PermitMapper.unloadedTransportDimensions.PERMIT_ID,
                PermitMapper.unloadedTransportDimensions.HEIGHT,
                PermitMapper.unloadedTransportDimensions.WIDTH,
                PermitMapper.unloadedTransportDimensions.LENGTH
        ).values(
                unloadedTransportDimensionsModel.getPermitId(),
                unloadedTransportDimensionsModel.getHeight(),
                unloadedTransportDimensionsModel.getWidth(),
                unloadedTransportDimensionsModel.getLength())
                .execute();
    }

    private void insertVehicles(DSLContext ctx, PermitModel permitModel) {
        List<VehicleModel> vehicles = permitModel.getVehicles();

        for (VehicleModel vehicleModel : vehicles) {
            vehicleModel.setPermitId(permitModel.getId());

            ctx.insertInto(PermitMapper.vehicle,
                    PermitMapper.vehicle.PERMIT_ID,
                    PermitMapper.vehicle.TYPE,
                    PermitMapper.vehicle.IDENTIFIER
            ).values(
                    vehicleModel.getPermitId(),
                    vehicleModel.getType(),
                    vehicleModel.getIdentifier())
                    .execute();
        }
    }

    private void insertAxleChart(DSLContext ctx, PermitModel permitModel) {
        AxleChartModel axleChartModel = permitModel.getAxleChart();
        axleChartModel.setPermitId(permitModel.getId());

        Record1<Integer> axleChartIdResult = ctx.insertInto(PermitMapper.axleChart,
                PermitMapper.axleChart.PERMIT_ID)
                .values(axleChartModel.getPermitId())
                .returningResult(PermitMapper.axleChart.ID)
                .fetchOne();

        Integer axleChartId = axleChartIdResult != null ? axleChartIdResult.value1() : null;
        axleChartModel.setId(axleChartId);

        insertAxles(ctx, axleChartModel);
    }

    private void insertAxles(DSLContext ctx, AxleChartModel axleChartModel) {
        List<AxleModel> axles = axleChartModel.getAxles();

        for (AxleModel axleModel : axles) {
            axleModel.setAxleChartId(axleChartModel.getId());

            ctx.insertInto(PermitMapper.axle,
                    PermitMapper.axle.AXLE_CHART_ID,
                    PermitMapper.axle.AXLE_NUMBER,
                    PermitMapper.axle.WEIGHT,
                    PermitMapper.axle.DISTANCE_TO_NEXT,
                    PermitMapper.axle.MAX_DISTANCE_TO_NEXT)
                    .values(
                            axleModel.getAxleChartId(),
                            axleModel.getAxleNumber(),
                            axleModel.getWeight(),
                            axleModel.getDistanceToNext(),
                            axleModel.getMaxDistanceToNext())
                    .execute();
        }
    }

    private void insertRouteAndRouteBridges(DSLContext ctx, RouteModel routeModel) {
        Record1<Integer> routeIdResult = ctx.insertInto(PermitMapper.route,
                PermitMapper.route.PERMIT_ID,
                PermitMapper.route.LELU_ID,
                PermitMapper.route.NAME,
                PermitMapper.route.ORDER_NUMBER,
                PermitMapper.route.TRANSPORT_COUNT,
                PermitMapper.route.ALTERNATIVE_ROUTE
                // TODO address ids
        ).values(
                routeModel.getPermitId(),
                routeModel.getLeluId(),
                routeModel.getName(),
                routeModel.getOrderNumber(),
                routeModel.getTransportCount(),
                routeModel.getAlternativeRoute())
                .returningResult(PermitMapper.route.ID)
                .fetchOne();

        Integer routeID = routeIdResult != null ? routeIdResult.value1() : null;
        routeModel.setId(routeID);

        insertRouteBridges(ctx, routeModel);
    }

    private void insertRouteBridges(DSLContext ctx, RouteModel routeModel) {
        List<RouteBridgeModel> routeBridges = routeModel.getRouteBridges();

        for (RouteBridgeModel routeBridgeModel : routeBridges) {
            if (routeBridgeModel.getBridgeId() != null) {
                routeBridgeModel.setRouteId(routeModel.getId());

                ctx.insertInto(PermitMapper.routeBridge,
                        PermitMapper.routeBridge.ROUTE_ID,
                        PermitMapper.routeBridge.BRIDGE_ID,
                        PermitMapper.routeBridge.CROSSING_INSTRUCTION
                ).values(
                        routeBridgeModel.getRouteId(),
                        routeBridgeModel.getBridgeId(),
                        routeBridgeModel.getCrossingInstruction())
                        .execute();
            } else {
                logger.warn("BridgeId missing for routeBridge, cannot insert");
            }
        }
    }

    public void updatePermit(PermitModel permitModel, List<Integer> routesToDelete) throws DataAccessException {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(PermitMapper.permit)
                    .set(PermitMapper.permit.PERMIT_NUMBER, permitModel.getPermitNumber())
                    .set(PermitMapper.permit.LELU_VERSION, permitModel.getLeluVersion())
                    .set(PermitMapper.permit.LELU_LAST_MODIFIED_DATE, permitModel.getLeluLastModifiedDate())
                    .set(PermitMapper.permit.VALID_START_DATE, permitModel.getValidStartDate())
                    .set(PermitMapper.permit.VALID_END_DATE, permitModel.getValidEndDate())
                    .set(PermitMapper.permit.TRANSPORT_TOTAL_MASS, permitModel.getTransportTotalMass())
                    .set(PermitMapper.permit.ADDITIONAL_DETAILS, permitModel.getAdditionalDetails())
                    .where(PermitMapper.permit.ID.eq(permitModel.getId()))
                    .execute();

            updateTransportDimensions(ctx, permitModel);
            deleteVehiclesAndInsertNew(ctx, permitModel);
            deleteAxlesAndInsertNew(ctx, permitModel);

            deleteRouteBridgesFromPermit(ctx, permitModel);

            // Delete routes not listed in permit anymore
            ctx.delete(PermitMapper.route)
                    .where(PermitMapper.route.ID.in(routesToDelete))
                    .execute();

            // Update or insert routes based on route ID
            for (RouteModel routeModel : permitModel.getRoutes()) {
                routeModel.setPermitId(permitModel.getId());

                if (routeModel.getId() != null) {
                    updateRouteAndInsertRouteBridges(ctx, routeModel);
                } else {
                    insertRouteAndRouteBridges(ctx, routeModel);
                }
            }

        });
    }

    private void updateTransportDimensions(DSLContext ctx, PermitModel permitModel) {
        ctx.update(PermitMapper.transportDimensions)
                .set(PermitMapper.transportDimensions.HEIGHT, permitModel.getTransportDimensions().getHeight())
                .set(PermitMapper.transportDimensions.WIDTH, permitModel.getTransportDimensions().getWidth())
                .set(PermitMapper.transportDimensions.LENGTH, permitModel.getTransportDimensions().getLength())
                .where(PermitMapper.transportDimensions.PERMIT_ID.eq(permitModel.getId()))
                .execute();
    }

    private void deleteVehiclesAndInsertNew(DSLContext ctx, PermitModel permitModel) {
        ctx.delete(PermitMapper.vehicle)
                .where(PermitMapper.vehicle.PERMIT_ID.eq(permitModel.getId()))
                .execute();

        insertVehicles(ctx, permitModel);
    }

    private void deleteAxlesAndInsertNew(DSLContext ctx, PermitModel permitModel) {
        // Get axle chart ID which we need for inserting new axles
        Record1<Integer> axleChartIdResult = ctx.select(PermitMapper.axleChart.ID).from(PermitMapper.axleChart)
                .where(PermitMapper.axleChart.PERMIT_ID.eq(permitModel.getId()))
                .fetchOne();

        Integer axleChartId = axleChartIdResult != null ? axleChartIdResult.value1() : null;
        permitModel.getAxleChart().setId(axleChartId);

        ctx.delete(PermitMapper.axle)
                .where(PermitMapper.axle.AXLE_CHART_ID.eq(axleChartId))
                .execute();

        insertAxles(ctx, permitModel.getAxleChart());
    }

    private void deleteRouteBridgesFromPermit(DSLContext ctx, PermitModel permitModel) {
        ctx.delete(PermitMapper.routeBridge)
                .where(PermitMapper.routeBridge.ROUTE_ID.in(
                        ctx.select(PermitMapper.route.ID).from(PermitMapper.route)
                                .where(PermitMapper.route.PERMIT_ID.eq(permitModel.getId()))
                                .fetch()))
                .execute();
    }

    private void updateRouteAndInsertRouteBridges(DSLContext ctx, RouteModel routeModel) {
        ctx.update(PermitMapper.route)
                .set(PermitMapper.route.NAME, routeModel.getName())
                .set(PermitMapper.route.ORDER_NUMBER, routeModel.getOrderNumber())
                .set(PermitMapper.route.TRANSPORT_COUNT, routeModel.getTransportCount())
                .set(PermitMapper.route.ALTERNATIVE_ROUTE, routeModel.getAlternativeRoute())
                .where(PermitMapper.route.ID.eq(routeModel.getId()))
                .execute();

        insertRouteBridges(ctx, routeModel);
    }

}
