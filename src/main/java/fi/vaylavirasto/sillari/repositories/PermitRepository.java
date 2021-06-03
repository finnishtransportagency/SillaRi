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
                .where(PermitMapper.permit.COMPANY_ID.eq(companyId))
                .fetch(new PermitMapper());
    }

    public PermitModel getPermit(Integer id) {
        return dsl.select().from(PermitMapper.permit)
                .leftJoin(PermitMapper.axleChart)
                .on(PermitMapper.permit.ID.eq(PermitMapper.axleChart.PERMIT_ID))
                .leftJoin(PermitMapper.transportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.transportDimensions.PERMIT_ID))
                .where(PermitMapper.permit.ID.eq(id))
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
                    1, // FIXME!
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
            insertVehicles(ctx, permitModel);
            insertAxleChart(ctx, permitModel);

            return permitId;
        });
    }

    private void insertTransportDimensions(DSLContext ctx, PermitModel permitModel) {
        TransportDimensionsModel transportDimensions = permitModel.getTransportDimensions();
        transportDimensions.setPermitId(permitModel.getId());

        ctx.insertInto(PermitMapper.transportDimensions,
                PermitMapper.transportDimensions.PERMIT_ID,
                PermitMapper.transportDimensions.HEIGHT,
                PermitMapper.transportDimensions.WIDTH,
                PermitMapper.transportDimensions.LENGTH
        ).values(
                transportDimensions.getPermitId(),
                transportDimensions.getHeight(),
                transportDimensions.getWidth(),
                transportDimensions.getLength())
                .execute();
    }

    private void insertVehicles(DSLContext ctx, PermitModel permitModel) {
        List<VehicleModel> vehicles = permitModel.getVehicles();

        for (VehicleModel vehicle : vehicles) {
            vehicle.setPermitId(permitModel.getId());

            ctx.insertInto(PermitMapper.vehicle,
                    PermitMapper.vehicle.PERMIT_ID,
                    PermitMapper.vehicle.TYPE,
                    PermitMapper.vehicle.IDENTIFIER
            ).values(
                    vehicle.getPermitId(),
                    vehicle.getType(),
                    vehicle.getIdentifier())
                    .execute();
        }
    }

    private void insertAxleChart(DSLContext ctx, PermitModel permitModel) {
        AxleChartModel axleChart = permitModel.getAxleChart();
        axleChart.setPermitId(permitModel.getId());

        Record1<Integer> axleChartIdResult = ctx.insertInto(PermitMapper.axleChart,
                PermitMapper.axleChart.PERMIT_ID)
                .values(axleChart.getPermitId())
                .returningResult(PermitMapper.axleChart.ID)
                .fetchOne();

        Integer axleChartId = axleChartIdResult != null ? axleChartIdResult.value1() : null;
        axleChart.setId(axleChartId);

        List<AxleModel> axles = axleChart.getAxles();

        for (AxleModel axle : axles) {
            axle.setAxleChartId(axleChartId);

            ctx.insertInto(PermitMapper.axle,
                    PermitMapper.axle.AXLE_CHART_ID,
                    PermitMapper.axle.AXLE_NUMBER,
                    PermitMapper.axle.WEIGHT,
                    PermitMapper.axle.DISTANCE_TO_NEXT,
                    PermitMapper.axle.MAX_DISTANCE_TO_NEXT)
                    .values(
                            axle.getAxleChartId(),
                            axle.getAxleNumber(),
                            axle.getWeight(),
                            axle.getDistanceToNext(),
                            axle.getMaxDistanceToNext())
                    .execute();
        }
    }

    public Integer updatePermit(PermitModel permitModel) {
        dsl.update(PermitMapper.permit)
                .set(PermitMapper.permit.PERMIT_NUMBER, permitModel.getPermitNumber())
                .set(PermitMapper.permit.LELU_VERSION, permitModel.getLeluVersion())
                .set(PermitMapper.permit.LELU_LAST_MODIFIED_DATE, permitModel.getLeluLastModifiedDate())
                .set(PermitMapper.permit.VALID_START_DATE, permitModel.getValidStartDate())
                .set(PermitMapper.permit.VALID_END_DATE, permitModel.getValidEndDate())
                .set(PermitMapper.permit.TRANSPORT_TOTAL_MASS, permitModel.getTransportTotalMass())
                .set(PermitMapper.permit.ADDITIONAL_DETAILS, permitModel.getAdditionalDetails())
                .where(PermitMapper.permit.ID.eq(permitModel.getId()))
                .execute();
        return permitModel.getId();
    }

}
