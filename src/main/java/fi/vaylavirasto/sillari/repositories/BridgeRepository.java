package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.BridgeMapper;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.*;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class BridgeRepository {
    @Autowired
    private DSLContext dsl;

    private static final Logger logger = LogManager.getLogger();

    public String getBridgeGeoJson(Integer id) {
        // In ST_AsGeoJSON(geom, 0, 2), the '0' means decimal places, the '2' means the option to include the short CRS (EPSG:3067)
        Field<String> geojsonField = DSL.field("ST_AsGeoJSON(geom, 0, 2)", String.class);
        return dsl.select(geojsonField).from(TableAlias.bridge)
                .where(TableAlias.bridge.ID.eq(id))
                .fetchOne(geojsonField);
    }

    public Map<String, Integer> getBridgeIdsWithOIDs(List<String> oids) {
        Result<Record2<String, Integer>> result = dsl.select(TableAlias.bridge.OID, TableAlias.bridge.ID)
                .from(TableAlias.bridge)
                .where(TableAlias.bridge.OID.in(oids))
                .orderBy(TableAlias.bridge.OID)
                .fetch();

        Map<String, Integer> resultMap = result.intoMap(TableAlias.bridge.OID, TableAlias.bridge.ID);
        logger.debug("Bridge OIDs with corresponding Bridge IDs resultMap={}", resultMap);
        return resultMap;
    }

    public void updateBridgeGeom(Integer id, Integer x, Integer y) {
        dsl.transaction(configuration -> {
                    DSLContext ctx = DSL.using(configuration);
                    Field<String> geojsonField = DSL.field("ST_GeomFromText('POINT("+x+" "+y+")', 3067)", String.class);
                    ctx.update(TableAlias.bridge)
                            .set(TableAlias.bridge.GEOM, geojsonField)
                            .where(TableAlias.bridge.ID.eq(id))
                            .execute();
                });
    }


    public BridgeModel getBridge(String oid) {
        return dsl.select().from(TableAlias.bridge)
                .where(TableAlias.bridge.OID.eq(oid))
                .fetchAny(new BridgeMapper());
    }

    public Integer createBridge(BridgeModel bridge) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> permitIdResult = ctx.insertInto(TableAlias.permit,
                            TableAlias.bridge.OID,
                            TableAlias.bridge.IDENTIFIER,
                            TableAlias.bridge.MUNICIPALITY,
                            TableAlias.bridge.
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

    public Integer insert(BridgeModel bridge) {
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
    public void update(BridgeModel bridge) {
    }
}
