package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.SupervisionImageMapper;
import fi.vaylavirasto.sillari.model.SupervisionImageModel;
import fi.vaylavirasto.sillari.model.Sequences;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class SupervisionImageRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public Integer insertFileIfNotExists(SupervisionImageModel supervisionImage) {
        Integer existingId = getFileIdByObjectKey(supervisionImage.getObjectKey());

        if (existingId == null || existingId == 0) {
            Integer imageId = dsl.nextval(Sequences.SUPERVISION_IMAGE_ID_SEQ).intValue();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
            LocalDateTime taken = LocalDateTime.parse(supervisionImage.getTaken(), formatter);

            dsl.insertInto(TableAlias.supervisionImage,
                            TableAlias.supervisionImage.ID,
                            TableAlias.supervisionImage.SUPERVISION_ID,
                            TableAlias.supervisionImage.FILENAME,
                            TableAlias.supervisionImage.OBJECT_KEY,
                            TableAlias.supervisionImage.TAKEN)
                    .select(dsl.select(DSL.val(imageId),
                                    DSL.val(supervisionImage.getSupervisionId()),
                                    DSL.val(supervisionImage.getFilename()),
                                    DSL.val(supervisionImage.getObjectKey()),
                                    DSL.val(taken))
                            .whereNotExists(dsl.selectOne()
                                    .from(TableAlias.supervisionImage)
                                    .where(TableAlias.supervisionImage.OBJECT_KEY.eq(supervisionImage.getObjectKey()))))
                    .execute();
            return imageId;
        } else {
            return existingId;
        }
    }

    public SupervisionImageModel getFile(Integer fileId) {
        return dsl.select().from(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.ID.eq(fileId))
                .fetchOne(new SupervisionImageMapper());

    }

    public Integer getFileIdByObjectKey(String objectKey) {
        return dsl.select().from(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.OBJECT_KEY.eq(objectKey))
                .fetchOne(TableAlias.supervisionImage.ID);

    }

    public List<SupervisionImageModel> getFiles(Integer supervisionId) {
        return dsl.select().from(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.SUPERVISION_ID.eq(supervisionId))
                .fetch(new SupervisionImageMapper(true));
    }

    public int deleteFileByObjectKey(String objectKey) {
        return dsl.delete(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.OBJECT_KEY.eq(objectKey))
                .execute();
    }

}
