package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.dto.CoordinatesDTO;
import fi.vaylavirasto.sillari.mapper.BridgeMapper;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.*;
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
    private static final int WKID = 3067; // Spatial reference id

    public String getBridgeGeoJson(Integer id) {
        // In ST_AsGeoJSON(geom, 0, 2), the '0' means decimal places, the '2' means the option to include the short CRS (EPSG:3067)
        Field<String> geojsonField = DSL.field("ST_AsGeoJSON(geom, 0, 2)", String.class);
        return dsl.select(geojsonField).from(TableAlias.bridge)
                .where(TableAlias.bridge.ID.eq(id))
                .fetchOne(geojsonField);
    }

    /*public String getBridgeXCoord(Integer id) {
        Field<String> geojsonField = DSL.field("ST_X(geom)", String.class);
        return dsl.select(geojsonField).from(TableAlias.bridge)
                .where(TableAlias.bridge.ID.eq(id))
                .fetchOne(geojsonField);
    }*/

    /*public String getBridgeYCoord(Integer id) {
        Field<String> geojsonField = DSL.field("ST_Y(geom)", String.class);
        return dsl.select(geojsonField).from(TableAlias.bridge)
                .where(TableAlias.bridge.ID.eq(id))
                .fetchOne(geojsonField);
    }*/

    public CoordinatesDTO getBridgeCoordinates(Integer id) {
        Field<String> xString = DSL.field("ST_X(geom)", String.class);
        Field<String> yString = DSL.field("ST_Y(geom)", String.class);
        Record2<String, String> result = dsl.select(xString, yString).from(TableAlias.bridge)
                .where(TableAlias.bridge.ID.eq(id))
                .fetchOne();
        if (result != null) {
            String x = result.value1();
            String y = result.value2();
            if (x != null && y != null) {
                return new CoordinatesDTO(x, y);
            }
        }
        return null;
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
            Field<String> geojsonField = DSL.field("ST_GeomFromText('POINT(" + x + " " + y + ")', " + WKID + ")", String.class);
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


    public Integer createBridge(BridgeModel bridge) {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);
            Field<String> geojsonField = DSL.field("ST_GeomFromText('POINT(" + bridge.getCoordinates().getX() + " " + bridge.getCoordinates().getY() + ")', " + WKID + ")", String.class);
            Record1<Integer> bridgeIdResult = ctx.insertInto(TableAlias.bridge,
                            TableAlias.bridge.OID,
                            TableAlias.bridge.IDENTIFIER,
                            TableAlias.bridge.MUNICIPALITY,
                            TableAlias.bridge.NAME,
                            TableAlias.bridge.ROAD_ADDRESS,
                            TableAlias.bridge.STATUS,
                            TableAlias.bridge.GEOM
                    ).values(
                            bridge.getOid(),
                            bridge.getIdentifier(),
                            bridge.getMunicipality(),
                            bridge.getName(),
                            bridge.getRoadAddress(),
                            bridge.getStatus(),
                            geojsonField)

                    .returningResult(TableAlias.bridge.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer bridgeId = bridgeIdResult != null ? bridgeIdResult.value1() : null;
            bridge.setId(bridgeId);


            return bridgeId;
        });
    }

    public void updateBridge(BridgeModel bridge) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);
            Field<String> geojsonField = DSL.field("ST_GeomFromText('POINT(" + bridge.getCoordinates().getX() + " " + bridge.getCoordinates().getY() + ")', " + WKID + ")", String.class);

            ctx.update(TableAlias.bridge)
                    .set(TableAlias.bridge.OID, bridge.getOid())
                    .set(TableAlias.bridge.IDENTIFIER, bridge.getIdentifier())
                    .set(TableAlias.bridge.MUNICIPALITY, bridge.getMunicipality())
                    .set(TableAlias.bridge.NAME, bridge.getName())
                    .set(TableAlias.bridge.ROAD_ADDRESS, bridge.getRoadAddress())
                    .set(TableAlias.bridge.STATUS, bridge.getStatus())
                    .set(TableAlias.bridge.GEOM, geojsonField)
                    .where(TableAlias.bridge.ID.eq(bridge.getId()))
                    .execute();
        });
    }

}
