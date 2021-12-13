package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.AxleChartMapper;
import fi.vaylavirasto.sillari.mapper.PermitMapper;
import fi.vaylavirasto.sillari.mapper.TransportDimensionsMapper;
import fi.vaylavirasto.sillari.mapper.UnloadedTransportDimensionsMapper;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class PermitRepository {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    private DSLContext dsl;

    public List<PermitModel> getPermitsByCompanyId(Integer companyId) {
        return dsl.select().from(TableAlias.permit)
                .where(TableAlias.permit.COMPANY_ID.eq(companyId))
                .fetch(new PermitMapper(true));
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

    public PermitModel getPermitByPermitNumber(String permitNumber) {
        return dsl.select().from(TableAlias.permit)
                .leftJoin(TableAlias.axleChart)
                .on(TableAlias.permit.ID.eq(TableAlias.axleChart.PERMIT_ID))
                .leftJoin(TableAlias.transportDimensions)
                .on(TableAlias.permit.ID.eq(TableAlias.transportDimensions.PERMIT_ID))
                .leftJoin(TableAlias.unloadedTransportDimensions)
                .on(TableAlias.permit.ID.eq(TableAlias.unloadedTransportDimensions.PERMIT_ID))
                .where(TableAlias.permit.PERMIT_NUMBER.eq(permitNumber))
                .fetchAny(this::mapPermitRecordWithAxleChartAndDimensions);
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

    public Integer getPermitIdByPermitNumber(String permitNumber) {
        Record1<Integer> record = dsl.select(TableAlias.permit.ID).from(TableAlias.permit)
                .where(TableAlias.permit.PERMIT_NUMBER.eq(permitNumber))
                .fetchAny();
        return record != null ? record.value1() : null;
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
                            TableAlias.permit.LELU_LAST_MODIFIED_DATE,
                            TableAlias.permit.VALID_START_DATE,
                            TableAlias.permit.VALID_END_DATE,
                            TableAlias.permit.TRANSPORT_TOTAL_MASS,
                            TableAlias.permit.ADDITIONAL_DETAILS
                    ).values(
                            permitModel.getCompanyId(),
                            permitModel.getPermitNumber(),
                            permitModel.getLeluVersion(),
                            permitModel.getLeluLastModifiedDate(),
                            permitModel.getValidStartDate(),
                            permitModel.getValidEndDate(),
                            permitModel.getTransportTotalMass(),
                            permitModel.getAdditionalDetails())
                    .returningResult(TableAlias.permit.ID)
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

        for (VehicleModel vehicleModel : vehicles) {
            vehicleModel.setPermitId(permitModel.getId());

            ctx.insertInto(TableAlias.vehicle,
                            TableAlias.vehicle.PERMIT_ID,
                            TableAlias.vehicle.TYPE,
                            TableAlias.vehicle.IDENTIFIER
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
                        TableAlias.route.NAME,
                        TableAlias.route.TRANSPORT_COUNT,
                        TableAlias.route.ALTERNATIVE_ROUTE,
                        TableAlias.route.DEPARTURE_ADDRESS_ID,
                        TableAlias.route.ARRIVAL_ADDRESS_ID

                ).values(
                        routeModel.getPermitId(),
                        routeModel.getLeluId(),
                        routeModel.getName(),
                        routeModel.getTransportCount(),
                        routeModel.getAlternativeRoute(),
                        departureAddressId,
                        arrivalAddressId)
                .returningResult(TableAlias.route.ID)
                .fetchOne();

        Integer routeID = routeIdResult != null ? routeIdResult.value1() : null;
        routeModel.setId(routeID);

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

    private void insertRouteBridges(DSLContext ctx, RouteModel route) {
        List<RouteBridgeModel> routeBridges = route.getRouteBridges();

        for (int i = 0; i < routeBridges.size(); i++) {
            RouteBridgeModel routeBridge = routeBridges.get(i);

            if (routeBridge.getBridgeId() != null) {
                routeBridge.setRouteId(route.getId());
                routeBridge.setOrdinal(i + 1);

                ctx.insertInto(TableAlias.routeBridge,
                                TableAlias.routeBridge.ROUTE_ID,
                                TableAlias.routeBridge.BRIDGE_ID,
                                TableAlias.routeBridge.ORDINAL,
                                TableAlias.routeBridge.CROSSING_INSTRUCTION,
                                TableAlias.routeBridge.CONTRACT_NUMBER
                        ).values(
                                routeBridge.getRouteId(),
                                routeBridge.getBridgeId(),
                                routeBridge.getOrdinal(),
                                routeBridge.getCrossingInstruction(),
                                routeBridge.getContractNumber())
                        .execute();
            } else {
                logger.warn("BridgeId missing for routeBridge, cannot insert");
            }
        }
    }

    public void deletePermit(PermitModel permitModel) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);
            deleteVehicles(ctx, permitModel);
            deleteAxles(ctx, permitModel);
            ctx.delete(TableAlias.axleChart)
                    .where(TableAlias.axleChart.PERMIT_ID.eq(permitModel.getId()))
                    .execute();

            deleteRoutes(ctx, permitModel);

            ctx.delete(TableAlias.unloadedTransportDimensions)
                    .where(TableAlias.unloadedTransportDimensions.PERMIT_ID.eq(permitModel.getId()))
                    .execute();

            ctx.delete(TableAlias.transportDimensions)
                    .where(TableAlias.transportDimensions.PERMIT_ID.eq(permitModel.getId()))
                    .execute();

            ctx.delete(TableAlias.permit)
                    .where(TableAlias.permit.ID.eq(permitModel.getId()))
                    .execute();

        });
    }

    private void deleteSupervisions(DSLContext ctx, RouteModel routeModel) {
        for (RouteBridgeModel routeBridge : routeModel.getRouteBridges()) {
            if (routeBridge.getSupervisions() != null) {
                List<Integer> supervisionIds = routeBridge.getSupervisions().stream().map(SupervisionModel::getId).collect(Collectors.toList());

                ctx.delete(TableAlias.supervisionStatus)
                        .where(TableAlias.supervisionStatus.SUPERVISION_ID.in(supervisionIds))
                        .execute();
                ctx.delete(TableAlias.supervisionReport)
                        .where(TableAlias.supervisionReport.SUPERVISION_ID.in(supervisionIds))
                        .execute();
                ctx.delete(TableAlias.supervisionImage)
                        .where(TableAlias.supervisionImage.SUPERVISION_ID.in(supervisionIds))
                        .execute();
                ctx.delete(TableAlias.supervisionSupervisor)
                        .where(TableAlias.supervisionSupervisor.SUPERVISION_ID.in(supervisionIds))
                        .execute();
                ctx.delete(TableAlias.supervision)
                        .where(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(routeBridge.getId()))
                        .execute();
            }
        }
    }

    public void updatePermit(PermitModel permitModel, List<Integer> routesToDelete) throws DataAccessException {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.permit)
                    .set(TableAlias.permit.PERMIT_NUMBER, permitModel.getPermitNumber())
                    .set(TableAlias.permit.LELU_VERSION, permitModel.getLeluVersion())
                    .set(TableAlias.permit.LELU_LAST_MODIFIED_DATE, permitModel.getLeluLastModifiedDate())
                    .set(TableAlias.permit.VALID_START_DATE, permitModel.getValidStartDate())
                    .set(TableAlias.permit.VALID_END_DATE, permitModel.getValidEndDate())
                    .set(TableAlias.permit.TRANSPORT_TOTAL_MASS, permitModel.getTransportTotalMass())
                    .set(TableAlias.permit.ADDITIONAL_DETAILS, permitModel.getAdditionalDetails())
                    .where(TableAlias.permit.ID.eq(permitModel.getId()))
                    .execute();

            updateTransportDimensions(ctx, permitModel);
            updateUnloadedTransportDimensions(ctx, permitModel);
            deleteVehiclesAndInsertNew(ctx, permitModel);
            deleteAxlesAndInsertNew(ctx, permitModel);

            deleteRouteBridgesFromPermit(ctx, permitModel);

            // Delete routes not listed in permit anymore
            deleteRoutes(routesToDelete, ctx);

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

    public void updatePermitPdf(Integer permitId, String pdfObjectKey) throws DataAccessException {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.permit)
                    .set(TableAlias.permit.PDF_OBJECT_KEY, pdfObjectKey)
                    .where(TableAlias.permit.ID.eq(permitId))
                    .execute();

        });
    }

    private void deleteRoutes(List<Integer> routesToDelete, DSLContext ctx) {
        for (Integer routeID : routesToDelete) {
            deleteAddresses(ctx, routeID);
        }
        ctx.delete(TableAlias.route)
                .where(TableAlias.route.ID.in(routesToDelete))
                .execute();
    }

    // TODO FIXME we cannot delete routes with existing supervisions!
    // This should only be possible in testing phase.
    private void deleteRoutes(DSLContext ctx, PermitModel permitModel) {
        for (RouteModel routeModel : permitModel.getRoutes()) {
            deleteSupervisions(ctx, routeModel);
            deleteRouteTransports(ctx, routeModel);
            deleteRouteBridges(ctx, routeModel);
            deleteAddresses(ctx, routeModel.getId());
        }
        ctx.delete(TableAlias.route)
                .where(TableAlias.route.PERMIT_ID.eq(permitModel.getId()))
                .execute();
    }

    private void updateTransportDimensions(DSLContext ctx, PermitModel permitModel) {
        ctx.update(TableAlias.transportDimensions)
                .set(TableAlias.transportDimensions.HEIGHT, permitModel.getTransportDimensions().getHeight())
                .set(TableAlias.transportDimensions.WIDTH, permitModel.getTransportDimensions().getWidth())
                .set(TableAlias.transportDimensions.LENGTH, permitModel.getTransportDimensions().getLength())
                .where(TableAlias.transportDimensions.PERMIT_ID.eq(permitModel.getId()))
                .execute();
    }

    private void updateUnloadedTransportDimensions(DSLContext ctx, PermitModel permitModel) {
        if (permitModel.getUnloadedTransportDimensions() != null) {
            ctx.update(TableAlias.unloadedTransportDimensions)
                    .set(TableAlias.unloadedTransportDimensions.HEIGHT, permitModel.getUnloadedTransportDimensions().getHeight())
                    .set(TableAlias.unloadedTransportDimensions.WIDTH, permitModel.getUnloadedTransportDimensions().getWidth())
                    .set(TableAlias.unloadedTransportDimensions.LENGTH, permitModel.getUnloadedTransportDimensions().getLength())
                    .where(TableAlias.unloadedTransportDimensions.PERMIT_ID.eq(permitModel.getId()))
                    .execute();
        }
    }

    private void deleteVehicles(DSLContext ctx, PermitModel permitModel) {
        ctx.delete(TableAlias.vehicle)
                .where(TableAlias.vehicle.PERMIT_ID.eq(permitModel.getId()))
                .execute();
    }

    private void deleteVehiclesAndInsertNew(DSLContext ctx, PermitModel permitModel) {
        deleteVehicles(ctx, permitModel);
        insertVehicles(ctx, permitModel);
    }

    private void deleteAxles(DSLContext ctx, PermitModel permitModel) {
        // Get axle chart ID which we need for inserting new axles
        Record1<Integer> axleChartIdResult = ctx.select(TableAlias.axleChart.ID)
                .from(TableAlias.axleChart)
                .where(TableAlias.axleChart.PERMIT_ID.eq(permitModel.getId()))
                .fetchOne();

        Integer axleChartId = axleChartIdResult != null ? axleChartIdResult.value1() : null;
        permitModel.getAxleChart().setId(axleChartId);

        ctx.delete(TableAlias.axle)
                .where(TableAlias.axle.AXLE_CHART_ID.eq(axleChartId))
                .execute();
    }

    private void deleteAxlesAndInsertNew(DSLContext ctx, PermitModel permitModel) {
        deleteAxles(ctx, permitModel);
        insertAxles(ctx, permitModel.getAxleChart());
    }

    private void deleteRouteBridgesFromPermit(DSLContext ctx, PermitModel permitModel) {
        ctx.delete(TableAlias.routeBridge)
                .where(TableAlias.routeBridge.ROUTE_ID.in(
                        ctx.select(TableAlias.route.ID).from(TableAlias.route)
                                .where(TableAlias.route.PERMIT_ID.eq(permitModel.getId()))
                                .fetch()))
                .execute();
    }

    private void deleteRouteBridges(DSLContext ctx, RouteModel routeModel) {
        ctx.delete(TableAlias.routeBridge)
                .where(TableAlias.routeBridge.ROUTE_ID.eq(routeModel.getId()))
                .execute();
    }

    private void deleteRouteTransports(DSLContext ctx, RouteModel routeModel) {
        ctx.delete(TableAlias.transportStatus)
                .where(TableAlias.transportStatus.ROUTE_TRANSPORT_ID.in(ctx.select(TableAlias.routeTransport.ID)
                .from(TableAlias.routeTransport)
                .where(TableAlias.routeTransport.ROUTE_ID.eq(routeModel.getId()))
                .fetch()))
                .execute();

        ctx.delete(TableAlias.routeTransport)
                .where(TableAlias.routeTransport.ROUTE_ID.eq(routeModel.getId()))
                .execute();
    }

    private void updateRouteAndInsertRouteBridges(DSLContext ctx, RouteModel routeModel) {
        ctx.update(TableAlias.route)
                .set(TableAlias.route.ARRIVAL_ADDRESS_ID, (Integer) null)
                .set(TableAlias.route.DEPARTURE_ADDRESS_ID, (Integer) null)
                .where(TableAlias.route.ID.eq(routeModel.getId()))
                .execute();

        Integer departureAddressId = deleteDepartureAddressAndInsertNew(ctx, routeModel);
        Integer arrivalAddressId = deleteArrivalAddressAndInsertNew(ctx, routeModel);
        ctx.update(TableAlias.route)
                .set(TableAlias.route.NAME, routeModel.getName())
                .set(TableAlias.route.TRANSPORT_COUNT, routeModel.getTransportCount())
                .set(TableAlias.route.ALTERNATIVE_ROUTE, routeModel.getAlternativeRoute())
                .set(TableAlias.route.ARRIVAL_ADDRESS_ID, arrivalAddressId)
                .set(TableAlias.route.DEPARTURE_ADDRESS_ID, departureAddressId)
                .where(TableAlias.route.ID.eq(routeModel.getId()))
                .execute();

        insertRouteBridges(ctx, routeModel);
    }


    private Integer deleteDepartureAddressAndInsertNew(DSLContext ctx, RouteModel routeModel) {
        deleteDepartureAddress(ctx, routeModel.getId());
        return insertDepartureAddress(ctx, routeModel);
    }

    private Integer deleteArrivalAddressAndInsertNew(DSLContext ctx, RouteModel routeModel) {
        deleteArrivalAddress(ctx, routeModel.getId());
        return insertArrivalAddress(ctx, routeModel);
    }

    private void deleteDepartureAddress(DSLContext ctx, Integer routeId) {
        Record1<Integer> departureRecord = ctx.select(TableAlias.route.DEPARTURE_ADDRESS_ID)
                .from(TableAlias.route)
                .where(TableAlias.route.ID.eq(routeId))
                .fetchOne();
        Integer departureID = departureRecord != null ? departureRecord.value1() : null;
        ctx.delete(TableAlias.departureAddress)
                .where(TableAlias.departureAddress.ID.eq(departureID))
                .execute();
    }

    private void deleteArrivalAddress(DSLContext ctx, Integer routeId) {
        Record1<Integer> arrivalRecord = ctx.select(TableAlias.route.ARRIVAL_ADDRESS_ID)
                .from(TableAlias.route)
                .where(TableAlias.route.ID.eq(routeId))
                .fetchOne();
        Integer arrivalID = arrivalRecord != null ? arrivalRecord.value1() : null;
        ctx.delete(TableAlias.arrivalAddress)
                .where(TableAlias.arrivalAddress.ID.eq(arrivalID))
                .execute();
    }

    private void deleteAddresses(DSLContext ctx, Integer routeId) {
        ctx.update(TableAlias.route)
                .set(TableAlias.route.ARRIVAL_ADDRESS_ID, (Integer) null)
                .set(TableAlias.route.DEPARTURE_ADDRESS_ID, (Integer) null)
                .where(TableAlias.route.ID.eq(routeId))
                .execute();
        deleteArrivalAddress(ctx, routeId);
        deleteDepartureAddress(ctx, routeId);
    }

    public boolean hasSupervisions(List<Integer> routeIds) {
        Record record = dsl.select().from(TableAlias.supervision)
                .leftJoin(TableAlias.routeBridge)
                .on(TableAlias.routeBridge.ID.eq(TableAlias.supervision.ROUTE_BRIDGE_ID))
                .where(TableAlias.routeBridge.ROUTE_ID.in(routeIds))
                .fetchAny();
        return record != null;
    }

}
