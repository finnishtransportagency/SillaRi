package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.*;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CrossingRepository {
    @Autowired
    private DSLContext dsl;

    public List<CrossingModel> getRoutesCrossings(Integer routeId) {
        return dsl.select().from(CrossingMapper.crossing)
                .leftJoin(CrossingMapper.bridge).on(CrossingMapper.bridge.ID.eq(CrossingMapper.crossing.BRIDGE_ID))
                .where(CrossingMapper.crossing.ROUTE_ID.eq(routeId))
                .fetch(new CrossingMapper());
    }
}
