package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.*;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.Date;
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
    public CrossingModel updateCrossing(CrossingInputModel crossingModel) {
        dsl.update(CrossingMapper.crossing)
                .set(CrossingMapper.crossing.DRIVINGLINEINFODESCRIPTION, crossingModel.getDrivingLineInfoDescription())
                .set(CrossingMapper.crossing.DAMAGE, crossingModel.isDamage())
                .set(CrossingMapper.crossing.TWIST, crossingModel.isDamage())
                .set(CrossingMapper.crossing.EXTRAINFODESCRIPTION, crossingModel.getExtraInfoDescription())
                .set(CrossingMapper.crossing.SPEEDINFODESCRIPTION, crossingModel.getSpeedInfoDescription())
                .set(CrossingMapper.crossing.EXCEPTIONSINFODESCRIPTION, crossingModel.getExceptionsInfoDescription())
                .set(CrossingMapper.crossing.SPEEDINFO, crossingModel.isSpeedInfo())
                .set(CrossingMapper.crossing.EXCEPTIONSINFO, crossingModel.isExceptionsInfo())
                .set(CrossingMapper.crossing.DRIVINGLINEINFO, crossingModel.isDrivingLineInfo())
                .set(CrossingMapper.crossing.PERMANENTBENDINGS, crossingModel.isPermanentBendings())
                .set(CrossingMapper.crossing.DESCRIBE, crossingModel.isDescribe())
                .where(CrossingMapper.crossing.ID.eq(crossingModel.getId()))
                .execute();
        return getCrossing(crossingModel.getId());
    }
    public CrossingModel createCrossing(Integer routeId, Integer bridgeId) {
        Integer crossingId = dsl.nextval(Sequences.CROSSING_ID_SEQ).intValue();
        LocalDateTime now = LocalDateTime.now();;
        dsl.insertInto(CrossingMapper.crossing,
                CrossingMapper.crossing.ID,
                CrossingMapper.crossing.ROUTE_ID,
                CrossingMapper.crossing.BRIDGE_ID,
                CrossingMapper.crossing.NAME,
                CrossingMapper.crossing.DAMAGE, CrossingMapper.crossing.PERMANENTBENDINGS, CrossingMapper.crossing.TWIST,
                CrossingMapper.crossing.SPEEDINFO, CrossingMapper.crossing.SPEEDINFODESCRIPTION,
                CrossingMapper.crossing.DRIVINGLINEINFO, CrossingMapper.crossing.DRIVINGLINEINFODESCRIPTION,
                CrossingMapper.crossing.EXCEPTIONSINFO, CrossingMapper.crossing.EXCEPTIONSINFODESCRIPTION,
                CrossingMapper.crossing.DESCRIBE, CrossingMapper.crossing.EXTRAINFODESCRIPTION,
                CrossingMapper.crossing.STARTED
                )
        .values(crossingId, routeId, bridgeId, "",
                false, false, false,
                true,"",
                true,"",
                false,"",
                false,"",
                now)
        .execute();

        return getCrossing(crossingId);
    }
    public CrossingModel getCrossing(Integer crossingId) {
        return dsl.select().from(CrossingMapper.crossing)
                .leftJoin(CrossingMapper.bridge).on(CrossingMapper.bridge.ID.eq(CrossingMapper.crossing.BRIDGE_ID))
                .where(CrossingMapper.crossing.ID.eq(crossingId))
                .fetchOne(new CrossingMapper());
    }
}
