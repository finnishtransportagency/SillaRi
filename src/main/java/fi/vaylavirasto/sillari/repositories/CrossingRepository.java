package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.*;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    public Integer updateCrossing(CrossingInputModel crossingModel) {
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
        return crossingModel.getId();
    }
    public Integer createCrossing(Integer routeId, Integer bridgeId) {
        Integer crossingId = dsl.nextval(Sequences.CROSSING_ID_SEQ).intValue();
        LocalDateTime now = LocalDateTime.now();
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
                CrossingMapper.crossing.STARTED,
                CrossingMapper.crossing.DRAFT
                )
        .values(crossingId, routeId, bridgeId, "",
                false, false, false,
                true,"",
                true,"",
                false,"",
                false,"",
                now,
                true)
        .execute();

        return crossingId;
    }
    public CrossingModel getCrossing(Integer routeId, Integer bridgeId) {
        return dsl.select().from(CrossingMapper.crossing)
                .leftJoin(CrossingMapper.bridge).on(CrossingMapper.bridge.ID.eq(CrossingMapper.crossing.BRIDGE_ID))
                .where(CrossingMapper.crossing.ROUTE_ID.eq(routeId)
                        .and(CrossingMapper.crossing.BRIDGE_ID.eq(bridgeId))
                        .and(CrossingMapper.crossing.DRAFT.eq(true)))
                .fetchOne(new CrossingMapper());
    }
    public CrossingModel getCrossing(Integer crossingId, Boolean draft) {
        return dsl.select().from(CrossingMapper.crossing)
                .leftJoin(CrossingMapper.bridge).on(CrossingMapper.bridge.ID.eq(CrossingMapper.crossing.BRIDGE_ID))
                .where(CrossingMapper.crossing.ID.eq(crossingId)
                        .and(CrossingMapper.crossing.DRAFT.eq(draft)))
                .fetchOne(new CrossingMapper());
    }

    public Integer insertFile(FileModel fileModel) {
        Integer imageId = dsl.nextval(Sequences.CROSSING_IMAGE_ID_SEQ).intValue();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        LocalDateTime taken = LocalDateTime.parse(fileModel.getTaken().substring(0,19), formatter);
        dsl.insertInto(FileMapper.image,
                FileMapper.image.ID,
                FileMapper.image.CROSSING_ID,
                FileMapper.image.FILENAME,
                FileMapper.image.OBJECT_KEY,
                FileMapper.image.TAKEN)
                .values(imageId,
                        Long.valueOf(fileModel.getCrossingId()).intValue(),
                        fileModel.getFilename()+"_"+fileModel.getTaken()+"_"+imageId+".jpg",
                        fileModel.getObjectKey(),
                        taken)
                .execute();
        return imageId;
    }
    public FileModel getFile(Integer fileId) {
        return dsl.select().from(FileMapper.image)
                .where(FileMapper.image.ID.eq(fileId))
                .fetchOne(new FileMapper());

    }
    public List<FileModel> getFiles(Integer crossingId) {
        return dsl.select().from(FileMapper.image).where(FileMapper.image.CROSSING_ID.eq(crossingId))
                .fetch(new FileMapper(true));
    }
}
