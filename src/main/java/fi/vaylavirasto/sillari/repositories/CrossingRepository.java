package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.*;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class CrossingRepository {
    @Autowired
    private DSLContext dsl;

    public Integer updateCrossing(CrossingInputModel crossingModel) {
        dsl.update(CrossingMapper.crossing)
                .set(CrossingMapper.crossing.DRAFT, crossingModel.isDraft())
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

    public Integer createCrossing(Integer routeBridgeId) {
        Integer[] crossingId = new Integer[1];

        dsl.transaction(configuration -> {
            crossingId[0] = dsl.nextval(Sequences.CROSSING_ID_SEQ).intValue();
            LocalDateTime now = LocalDateTime.now();
            configuration.dsl().insertInto(CrossingMapper.crossing,
                    CrossingMapper.crossing.ID,
                    CrossingMapper.crossing.ROUTE_BRIDGE_ID,
                    CrossingMapper.crossing.NAME,
                    CrossingMapper.crossing.DAMAGE, CrossingMapper.crossing.PERMANENTBENDINGS, CrossingMapper.crossing.TWIST,
                    CrossingMapper.crossing.SPEEDINFO, CrossingMapper.crossing.SPEEDINFODESCRIPTION,
                    CrossingMapper.crossing.DRIVINGLINEINFO, CrossingMapper.crossing.DRIVINGLINEINFODESCRIPTION,
                    CrossingMapper.crossing.EXCEPTIONSINFO, CrossingMapper.crossing.EXCEPTIONSINFODESCRIPTION,
                    CrossingMapper.crossing.DESCRIBE, CrossingMapper.crossing.EXTRAINFODESCRIPTION,
                    CrossingMapper.crossing.STARTED,
                    CrossingMapper.crossing.DRAFT
                    )
            .values(crossingId[0], routeBridgeId, "",
                    false, false, false,
                    true,"",
                    true,"",
                    false,"",
                    false,"",
                    now,
                    true)
            .execute();
        });

        return crossingId[0];
    }

    public CrossingModel getCrossingByRouteBridgeId(Integer routeBridgeId) {
        return dsl.select().from(CrossingMapper.crossing)
                .where(CrossingMapper.crossing.ROUTE_BRIDGE_ID.eq(routeBridgeId))
                .fetchOne(new CrossingMapper());
    }

    public CrossingModel getCrossingById(Integer crossingId) {
        return dsl.select().from(CrossingMapper.crossing)
                .where(CrossingMapper.crossing.ID.eq(crossingId))
                .fetchOne(new CrossingMapper());
    }

    public Integer insertFileIfNotExists(FileModel fileModel) {
        Integer existingId = getFileIdByObjectKey(fileModel.getObjectKey());
        if (existingId == null || existingId == 0) {
            Integer imageId = dsl.nextval(Sequences.CROSSING_IMAGE_ID_SEQ).intValue();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
            LocalDateTime taken = LocalDateTime.parse(fileModel.getTaken(), formatter);
            dsl.insertInto(FileMapper.image,
                    FileMapper.image.ID,
                    FileMapper.image.CROSSING_ID,
                    FileMapper.image.FILENAME,
                    FileMapper.image.OBJECT_KEY,
                    FileMapper.image.TAKEN)
                    .select(dsl.select(DSL.val(imageId),
                            DSL.val(Long.valueOf(fileModel.getCrossingId()).intValue()),
                            DSL.val(fileModel.getFilename() + "_" + fileModel.getTaken() + "_" + imageId + ".jpg"),
                            DSL.val(fileModel.getObjectKey()),
                            DSL.val(taken))
                            .whereNotExists(dsl.selectOne()
                                    .from(FileMapper.image)
                                    .where(FileMapper.image.OBJECT_KEY.eq(fileModel.getObjectKey()))))
                    .execute();
            return imageId;
        } else {
            return existingId;
        }
    }

    public FileModel getFile(Integer fileId) {
        return dsl.select().from(FileMapper.image)
                .where(FileMapper.image.ID.eq(fileId))
                .fetchOne(new FileMapper());

    }

    public Integer getFileIdByObjectKey(String objectKey) {
        return dsl.select().from(FileMapper.image)
                .where(FileMapper.image.OBJECT_KEY.eq(objectKey))
                .fetchOne(FileMapper.image.ID);

    }

    public List<FileModel> getFiles(Integer crossingId) {
        return dsl.select().from(FileMapper.image).where(FileMapper.image.CROSSING_ID.eq(crossingId))
                .fetch(new FileMapper(true));
    }

    public int deleteFileByObjectKey(String objectKey) {
        return dsl.delete(FileMapper.image)
                .where(FileMapper.image.OBJECT_KEY.eq(objectKey))
                .execute();
    }
}
