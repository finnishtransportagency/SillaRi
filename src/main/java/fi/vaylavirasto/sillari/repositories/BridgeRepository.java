package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.BridgeMapper;
import fi.vaylavirasto.sillari.model.BridgeModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.*;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
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

    public Map<Integer, String> getBridgeIdsWithOIDs(List<String> oids) {
        List<Condition> conditions = new ArrayList<>();
        for (String oid : oids) {
            conditions.add(BridgeMapper.bridge.OID.eq(oid));
        }

        Result<Record2<Integer, String>> result = dsl.select(BridgeMapper.bridge.ID, BridgeMapper.bridge.OID)
                .from(BridgeMapper.bridge)
                .where(BridgeMapper.bridge.STATUS.isNotNull()) // FIXME status should be what exactly?
                .and(DSL.or(conditions))
                .orderBy(BridgeMapper.bridge.OID)
                .fetch();

        Map<Integer, String> resultMap = result.intoMap(BridgeMapper.bridge.ID, BridgeMapper.bridge.OID);
        logger.debug(resultMap);
        return resultMap;
    }

}
