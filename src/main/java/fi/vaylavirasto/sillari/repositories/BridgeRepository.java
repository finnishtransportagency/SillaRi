package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.BridgeMapper;
import fi.vaylavirasto.sillari.model.BridgeModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Field;
import org.jooq.Record2;
import org.jooq.Result;
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

    public BridgeModel getBridge(Integer id) {
        return dsl.select().from(BridgeMapper.bridge)
                .where(BridgeMapper.bridge.ID.eq(id))
                .fetchOne(new BridgeMapper());
    }

    public String getBridgeGeoJson(Integer id) {
        // In ST_AsGeoJSON(geom, 0, 2), the '0' means decimal places, the '2' means the option to include the short CRS (EPSG:3067)
        Field<String> geojsonField = DSL.field("ST_AsGeoJSON(geom, 0, 2)", String.class);
        return dsl.select(geojsonField).from(BridgeMapper.bridge)
                .where(BridgeMapper.bridge.ID.eq(id))
                .fetchOne(geojsonField);
    }

    public Map<String, Integer> getBridgeIdsWithOIDs(List<String> oids) {
        Result<Record2<String, Integer>> result = dsl.select(BridgeMapper.bridge.OID, BridgeMapper.bridge.ID)
                .from(BridgeMapper.bridge)
                .where(BridgeMapper.bridge.OID.in(oids))
                .orderBy(BridgeMapper.bridge.OID)
                .fetch();

        Map<String, Integer> resultMap = result.intoMap(BridgeMapper.bridge.OID, BridgeMapper.bridge.ID);
        logger.debug("Bridge OIDs with corresponding Bridge IDs resultMap={}", resultMap);
        return resultMap;
    }

}
