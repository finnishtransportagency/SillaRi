package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.aws.ObjectKeyGenerator;
import fi.vaylavirasto.sillari.mapper.SupervisionImageMapper;
import fi.vaylavirasto.sillari.model.SupervisionImageModel;
import fi.vaylavirasto.sillari.model.Sequences;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
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
        Integer existingId = getFileIdByFilename(supervisionImage.getFilename());

        if (existingId == null || existingId == 0) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
            LocalDateTime taken = LocalDateTime.parse(supervisionImage.getTaken(), formatter);

            return dsl.transactionResult(configuration -> {
                DSLContext ctx = DSL.using(configuration);

                Integer imageId = ctx.nextval(Sequences.SUPERVISION_IMAGE_ID_SEQ).intValue();
                String objectIdentifier = ObjectKeyGenerator.generateObjectIdentifier(ObjectKeyGenerator.IMAGE_KTV_PREFIX, imageId);
                String objectKey = ObjectKeyGenerator.generateObjectKey(objectIdentifier, supervisionImage.getSupervisionId());

                Record1<Integer> imageIdResult = ctx.insertInto(TableAlias.supervisionImage,
                                TableAlias.supervisionImage.ID,
                                TableAlias.supervisionImage.SUPERVISION_ID,
                                TableAlias.supervisionImage.FILENAME,
                                TableAlias.supervisionImage.TAKEN,
                                TableAlias.supervisionImage.OBJECT_KEY,
                                TableAlias.supervisionImage.KTV_OBJECT_ID)
                        .values(imageId,
                                supervisionImage.getSupervisionId(),
                                supervisionImage.getFilename(),
                                taken,
                                objectKey,
                                objectIdentifier)
                        .returningResult(TableAlias.supervisionImage.ID)
                        .fetchOne(); // Execute and return zero or one record
                return imageIdResult != null ? imageIdResult.value1() : null;
            });
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

    public Integer getFileIdByFilename(String filename) {
        return dsl.select().from(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.FILENAME.eq(filename))
                .fetchOne(TableAlias.supervisionImage.ID);

    }

    public List<SupervisionImageModel> getFiles(Integer supervisionId) {
        return dsl.select().from(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.SUPERVISION_ID.eq(supervisionId))
                .fetch(new SupervisionImageMapper(true));
    }

    public int deleteFileByImageId(Integer id) {
        return dsl.delete(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.ID.eq(id))
                .execute();
    }

    public int deleteFilesBySupervisionId(Integer supervisionId) {
        return dsl.delete(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.SUPERVISION_ID.eq(supervisionId))
                .execute();
    }

}
