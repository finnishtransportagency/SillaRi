package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.AxleChartMapper;
import fi.vaylavirasto.sillari.mapper.PermitMapper;
import fi.vaylavirasto.sillari.mapper.TransportDimensionsMapper;
import fi.vaylavirasto.sillari.mapper.UnloadedTransportDimensionsMapper;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.util.TableAlias;
import lombok.extern.slf4j.Slf4j;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

import static org.jooq.impl.DSL.exists;
import static org.jooq.impl.DSL.select;

@Slf4j
@Repository
public class PermitRepository {
    @Autowired
    private DSLContext dsl;

    public List<PermitModel> getPermitsByCompanyId(Integer companyId, OffsetDateTime validAfter) {
        return dsl.select().from(TableAlias.permit)
                .where(TableAlias.permit.COMPANY_ID.eq(companyId))
                .and(TableAlias.permit.VALID_END_DATE.greaterThan(validAfter.minusDays(1)))
                .and(isPermitVersionRelevant())
                .fetch(new PermitMapper(true));
    }

    private Condition isPermitVersionRelevant() {
        return TableAlias.permit.IS_CURRENT_VERSION.isTrue().or(
                exists(select(TableAlias.routeTransport.ID)
                        .from(TableAlias.routeTransport)
                        .innerJoin(TableAlias.route).on(TableAlias.routeTransport.ROUTE_ID.eq(TableAlias.route.ID))
                        .where(TableAlias.route.PERMIT_ID.eq(TableAlias.permit.ID))
                )
        );
    }

    public List<PermitModel> getPermitsByPermitNumber(String permitNumber) {
        return dsl.select().from(TableAlias.permit)
                .where(TableAlias.permit.PERMIT_NUMBER.eq(permitNumber))
                .fetch(new PermitMapper(false));
    }

    public PermitModel getPermit(Integer id) {
        return dsl.select().from(TableAlias.permit)
                .leftJoin(TableAlias.axleChart)
                .on(TableAlias.permit.ID.eq(TableAlias.axleChart.PERMIT_ID))
                .leftJoin(TableAlias.transportDimensions)
                .on(TableAlias.permit.ID.eq(TableAlias.transportDimensions.PERMIT_ID))
                .leftJoin(TableAlias.unloadedTransportDimensions)
                .on(TableAlias.permit.ID.eq(TableAlias.unloadedTransportDimensions.PERMIT_ID))
                .where(TableAlias.permit.ID.eq(id))
                .fetchOne(this::mapPermitRecordWithAxleChartAndDimensions);
    }

    public PermitModel getPermitCurrentVersionByPermitNumber(String permitNumber) {
        return dsl.select().from(TableAlias.permit)
                .where(TableAlias.permit.PERMIT_NUMBER.eq(permitNumber).and(TableAlias.permit.IS_CURRENT_VERSION.isTrue()))
                .fetchOne(new PermitMapper());
    }

    public PermitModel getPermitByRouteTransportId(Integer routeTransportId) {
        return dsl.select().from(TableAlias.permit)
                .innerJoin(TableAlias.route)
                .on(TableAlias.permit.ID.eq(TableAlias.route.PERMIT_ID))
                .innerJoin(TableAlias.routeTransport)
                .on(TableAlias.route.ID.eq(TableAlias.routeTransport.ROUTE_ID))
                .leftJoin(TableAlias.axleChart)
                .on(TableAlias.permit.ID.eq(TableAlias.axleChart.PERMIT_ID))
                .leftJoin(TableAlias.transportDimensions)
                .on(TableAlias.permit.ID.eq(TableAlias.transportDimensions.PERMIT_ID))
                .leftJoin(TableAlias.unloadedTransportDimensions)
                .on(TableAlias.permit.ID.eq(TableAlias.unloadedTransportDimensions.PERMIT_ID))
                .where(TableAlias.routeTransport.ID.eq(routeTransportId))
                .fetchOne(this::mapPermitRecordWithAxleChartAndDimensions);
    }

    public PermitModel getPermitByRouteId(Integer routeId) {
        return dsl.select().from(TableAlias.permit)
                .innerJoin(TableAlias.route).on(TableAlias.route.PERMIT_ID.eq(TableAlias.permit.ID))
                .where(TableAlias.route.ID.eq(routeId))
                .fetchOne(new PermitMapper());
    }

    private PermitModel mapPermitRecordWithAxleChartAndDimensions(Record record) {
        PermitMapper permitMapper = new PermitMapper(true);
        PermitModel permit = permitMapper.map(record);
        if (permit != null) {
            AxleChartMapper axleChartMapper = new AxleChartMapper();
            permit.setAxleChart(axleChartMapper.map(record));

            TransportDimensionsMapper transportDimensionsMapper = new TransportDimensionsMapper();
            permit.setTransportDimensions(transportDimensionsMapper.map(record));

            UnloadedTransportDimensionsMapper unloadedTransportDimensionsMapper = new UnloadedTransportDimensionsMapper();
            permit.setUnloadedTransportDimensions(unloadedTransportDimensionsMapper.map(record));
        }
        return permit;
    }

    public Integer getPermitIdByPermitNumberAndVersion(String permitNumber, int permitVersion) {
        Record1<Integer> record = dsl.select(TableAlias.permit.ID).from(TableAlias.permit)
                .where(TableAlias.permit.PERMIT_NUMBER.eq(permitNumber).and(TableAlias.permit.LELU_VERSION.eq(permitVersion)))
                .fetchOne();
        return record != null ? record.value1() : null;
    }



    public OffsetDateTime getPermitValidEndDateByRouteTransportId(DSLContext ctx, Integer routeTransportId) {
        Record1<OffsetDateTime> record = ctx.select(TableAlias.permit.VALID_END_DATE)
                .from(TableAlias.permit)
                .innerJoin(TableAlias.route)
                .on(TableAlias.permit.ID.eq(TableAlias.route.PERMIT_ID))
                .innerJoin(TableAlias.routeTransport)
                .on(TableAlias.route.ID.eq(TableAlias.routeTransport.ROUTE_ID))
                .where(TableAlias.routeTransport.ID.eq(routeTransportId))
                .fetchOne();
        return record != null ? record.value1() : null;
    }

    public Integer createPermit(PermitModel permitModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> permitIdResult = ctx.insertInto(TableAlias.permit,
                            TableAlias.permit.COMPANY_ID,
                            TableAlias.permit.PERMIT_NUMBER,
                            TableAlias.permit.LELU_VERSION,
                            TableAlias.permit.IS_CURRENT_VERSION,
                            TableAlias.permit.LELU_LAST_MODIFIED_DATE,
                            TableAlias.permit.VALID_START_DATE,
                            TableAlias.permit.VALID_END_DATE,
                            TableAlias.permit.TRANSPORT_TOTAL_MASS,
                            TableAlias.permit.ADDITIONAL_DETAILS,
                            TableAlias.permit.CUSTOMER_USES_SILLARI
                    ).values(
                            permitModel.getCompanyId(),
                            permitModel.getPermitNumber(),
                            permitModel.getLeluVersion(),
                            permitModel.getIsCurrentVersion(),
                            permitModel.getLeluLastModifiedDate(),
                            permitModel.getValidStartDate(),
                            permitModel.getValidEndDate(),
                            permitModel.getTransportTotalMass(),
                            permitModel.getAdditionalDetails(),
                            permitModel.getCustomerUsesSillari())
                    .returningResult(TableAlias.permit.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer permitId = permitIdResult != null ? permitIdResult.value1() : null;
            permitModel.setId(permitId);

            insertTransportDimensions(ctx, permitModel);
            insertUnloadedTransportDimensions(ctx, permitModel);
            insertVehicles(ctx, permitModel);
            if (permitModel.getAxleChart() != null) {
                insertAxleChart(ctx, permitModel);
            }

            for (int i = 0; i < permitModel.getRoutes().size(); i ++) {
                RouteModel routeModel = permitModel.getRoutes().get(i);
                routeModel.setPermitId(permitModel.getId());

                // TODO remove setting ordinal when LeLu is ready to send orderingNumber
                if (routeModel.getOrdinal() == null) {
                    routeModel.setOrdinal(i + 1);
                }

                insertRouteAndRouteBridges(ctx, routeModel);
            }

            return permitId;
        });
    }



    private void insertTransportDimensions(DSLContext ctx, PermitModel permitModel) {
        TransportDimensionsModel transportDimensionsModel = permitModel.getTransportDimensions();
        transportDimensionsModel.setPermitId(permitModel.getId());

        ctx.insertInto(TableAlias.transportDimensions,
                        TableAlias.transportDimensions.PERMIT_ID,
                        TableAlias.transportDimensions.HEIGHT,
                        TableAlias.transportDimensions.WIDTH,
                        TableAlias.transportDimensions.LENGTH
                ).values(
                        transportDimensionsModel.getPermitId(),
                        transportDimensionsModel.getHeight(),
                        transportDimensionsModel.getWidth(),
                        transportDimensionsModel.getLength())
                .execute();
    }

    private void insertUnloadedTransportDimensions(DSLContext ctx, PermitModel permitModel) {
        UnloadedTransportDimensionsModel unloadedTransportDimensionsModel = permitModel.getUnloadedTransportDimensions();
        if (unloadedTransportDimensionsModel != null) {
            unloadedTransportDimensionsModel.setPermitId(permitModel.getId());
            ctx.insertInto(TableAlias.unloadedTransportDimensions,
                            TableAlias.unloadedTransportDimensions.PERMIT_ID,
                            TableAlias.unloadedTransportDimensions.HEIGHT,
                            TableAlias.unloadedTransportDimensions.WIDTH,
                            TableAlias.unloadedTransportDimensions.LENGTH
                    ).values(
                            unloadedTransportDimensionsModel.getPermitId(),
                            unloadedTransportDimensionsModel.getHeight(),
                            unloadedTransportDimensionsModel.getWidth(),
                            unloadedTransportDimensionsModel.getLength())
                    .execute();
        }
    }

    private void insertVehicles(DSLContext ctx, PermitModel permitModel) {
        List<VehicleModel> vehicles = permitModel.getVehicles();

        for (int i = 0; i < vehicles.size(); i++) {
            VehicleModel vehicle = vehicles.get(i);

            vehicle.setPermitId(permitModel.getId());
            vehicle.setOrdinal(i + 1);
            String vehicleRole = vehicle.getRole() != null ? vehicle.getRole().toString() : null;

            ctx.insertInto(TableAlias.vehicle,
                            TableAlias.vehicle.PERMIT_ID,
                            TableAlias.vehicle.ORDINAL,
                            TableAlias.vehicle.TYPE,
                            TableAlias.vehicle.ROLE,
                            TableAlias.vehicle.IDENTIFIER
                    ).values(
                            vehicle.getPermitId(),
                            vehicle.getOrdinal(),
                            vehicle.getType(),
                            vehicleRole,
                            vehicle.getIdentifier())
                    .execute();
        }
    }

    private void insertAxleChart(DSLContext ctx, PermitModel permitModel) {
        AxleChartModel axleChartModel = permitModel.getAxleChart();
        axleChartModel.setPermitId(permitModel.getId());

        Record1<Integer> axleChartIdResult = ctx.insertInto(TableAlias.axleChart,
                        TableAlias.axleChart.PERMIT_ID)
                .values(axleChartModel.getPermitId())
                .returningResult(TableAlias.axleChart.ID)
                .fetchOne();

        Integer axleChartId = axleChartIdResult != null ? axleChartIdResult.value1() : null;
        axleChartModel.setId(axleChartId);

        insertAxles(ctx, axleChartModel);
    }

    private void insertAxles(DSLContext ctx, AxleChartModel axleChartModel) {
        List<AxleModel> axles = axleChartModel.getAxles();

        for (AxleModel axleModel : axles) {
            axleModel.setAxleChartId(axleChartModel.getId());

            ctx.insertInto(TableAlias.axle,
                            TableAlias.axle.AXLE_CHART_ID,
                            TableAlias.axle.AXLE_NUMBER,
                            TableAlias.axle.WEIGHT,
                            TableAlias.axle.DISTANCE_TO_NEXT,
                            TableAlias.axle.MAX_DISTANCE_TO_NEXT)
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
        Integer departureAddressId = insertDepartureAddress(ctx, routeModel);
        Integer arrivalAddressId = insertArrivalAddress(ctx, routeModel);

        Record1<Integer> routeIdResult = ctx.insertInto(TableAlias.route,
                        TableAlias.route.PERMIT_ID,
                        TableAlias.route.LELU_ID,
                        TableAlias.route.ORDINAL,
                        TableAlias.route.NAME,
                        TableAlias.route.TRANSPORT_COUNT,
                        TableAlias.route.ALTERNATIVE_ROUTE,
                        TableAlias.route.DEPARTURE_ADDRESS_ID,
                        TableAlias.route.ARRIVAL_ADDRESS_ID

                ).values(
                        routeModel.getPermitId(),
                        routeModel.getLeluId(),
                        routeModel.getOrdinal(),
                        routeModel.getName(),
                        routeModel.getTransportCount(),
                        routeModel.getAlternativeRoute(),
                        departureAddressId,
                        arrivalAddressId)
                .returningResult(TableAlias.route.ID)
                .fetchOne();

        Integer routeID = routeIdResult != null ? routeIdResult.value1() : null;
        routeModel.setId(routeID);

        insertRouteTransportNumbers(ctx, routeModel);
        insertRouteBridges(ctx, routeModel);
    }

    private Integer insertArrivalAddress(DSLContext ctx, RouteModel routeModel) {
        Record1<Integer> arrivalAddressIdResult = ctx.insertInto(TableAlias.arrivalAddress,
                        TableAlias.arrivalAddress.STREETADDRESS
                ).values(
                        routeModel.getArrivalAddress().getStreetAddress()
                )
                .returningResult(TableAlias.arrivalAddress.ID)
                .fetchOne();
        Integer arrivalAddressId = arrivalAddressIdResult != null ? arrivalAddressIdResult.value1() : null;
        routeModel.getArrivalAddress().setId(arrivalAddressId);
        return arrivalAddressId;
    }

    private Integer insertDepartureAddress(DSLContext ctx, RouteModel routeModel) {
        Record1<Integer> departureAddressIdResult = ctx.insertInto(TableAlias.departureAddress,
                        TableAlias.departureAddress.STREETADDRESS
                ).values(
                        routeModel.getDepartureAddress().getStreetAddress()
                )
                .returningResult(TableAlias.departureAddress.ID)
                .fetchOne();
        Integer departureAddressId = departureAddressIdResult != null ? departureAddressIdResult.value1() : null;
        routeModel.getDepartureAddress().setId(departureAddressId);
        return departureAddressId;
    }

    private void insertRouteTransportNumbers(DSLContext context, RouteModel route) {
        Integer totalTransportCount = route.getTransportCount();

        if (totalTransportCount != null && totalTransportCount > 0) {
            for (int i = 0; i < totalTransportCount; i++) {
                Integer transportNumber = i + 1;

                context.insertInto(TableAlias.routeTransportNumber,
                                TableAlias.routeTransportNumber.ROUTE_ID,
                                TableAlias.routeTransportNumber.TRANSPORT_NUMBER,
                                TableAlias.routeTransportNumber.USED
                        ).values(
                                route.getId(),
                                transportNumber,
                                false)
                        .execute();
            }
        }
    }

    private void insertRouteBridges(DSLContext ctx, RouteModel route) {
        List<RouteBridgeModel> routeBridges = route.getRouteBridges();

        for (int i = 0; i < routeBridges.size(); i++) {
            RouteBridgeModel routeBridge = routeBridges.get(i);

            if (routeBridge.getBridgeId() != null) {
                routeBridge.setRouteId(route.getId());

                // TODO remove setting ordinal when LeLu is ready to send orderingNumber
                if (routeBridge.getOrdinal() == null) {
                    routeBridge.setOrdinal(i + 1);
                }

                ctx.insertInto(TableAlias.routeBridge,
                                TableAlias.routeBridge.ROUTE_ID,
                                TableAlias.routeBridge.BRIDGE_ID,
                                TableAlias.routeBridge.ORDINAL,
                                TableAlias.routeBridge.CROSSING_INSTRUCTION,
                                TableAlias.routeBridge.CONTRACT_NUMBER,
                                TableAlias.routeBridge.CONTRACT_BUSINESS_ID,
                                TableAlias.routeBridge.TRANSPORT_NUMBER
                        ).values(
                                routeBridge.getRouteId(),
                                routeBridge.getBridgeId(),
                                routeBridge.getOrdinal(),
                                routeBridge.getCrossingInstruction(),
                                routeBridge.getContractNumber(),
                                routeBridge.getContractBusinessId(),
                                routeBridge.getTransportNumber())
                        .execute();
            } else {
                log.warn("BridgeId missing for routeBridge, cannot insert");
            }
        }
    }

    public void updatePermitCurrentVersion(Integer permitId, Boolean isCurrentVersion) throws DataAccessException {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.permit)
                    .set(TableAlias.permit.IS_CURRENT_VERSION, isCurrentVersion)
                    .where(TableAlias.permit.ID.eq(permitId))
                    .execute();
        });
    }

    public void updatePermitPdf(Integer permitId, String pdfObjectKey) throws DataAccessException {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.permit)
                    .set(TableAlias.permit.PDF_OBJECT_KEY, pdfObjectKey)
                    .where(TableAlias.permit.ID.eq(permitId))
                    .execute();

        });
    }

}
