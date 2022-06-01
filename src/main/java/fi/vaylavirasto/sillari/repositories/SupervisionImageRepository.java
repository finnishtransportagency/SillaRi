package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.SupervisionImageMapper;
import fi.vaylavirasto.sillari.model.Sequences;
import fi.vaylavirasto.sillari.model.SupervisionImageModel;
import fi.vaylavirasto.sillari.util.DateMapper;
import fi.vaylavirasto.sillari.util.ObjectKeyUtil;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class SupervisionImageRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public Integer insertSupervisionImageIfNotExists(SupervisionImageModel supervisionImage) {
        Integer existingId = getSupervisionImageIdByFilename(supervisionImage.getFilename());

        if (existingId == null || existingId == 0) {
            LocalDateTime taken = DateMapper.stringToLocalDate(supervisionImage.getTaken());

            return dsl.transactionResult(configuration -> {
                DSLContext ctx = DSL.using(configuration);

                Integer imageId = ctx.nextval(Sequences.SUPERVISION_IMAGE_ID_SEQ).intValue();
                String objectIdentifier = ObjectKeyUtil.generateObjectIdentifier(ObjectKeyUtil.IMAGE_KTV_PREFIX, imageId);
                String objectKey = ObjectKeyUtil.generateObjectKey(objectIdentifier, supervisionImage.getSupervisionId());

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

    public SupervisionImageModel getSupervisionImage(Integer id) {
        return dsl.select().from(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.ID.eq(id))
                .fetchOne(new SupervisionImageMapper());

    }

    public Integer getSupervisionImageIdByFilename(String filename) {
        return dsl.select().from(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.FILENAME.eq(filename))
                .fetchOne(TableAlias.supervisionImage.ID);

    }

    public List<SupervisionImageModel> getSupervisionImages(Integer supervisionId) {
        return dsl.select().from(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.SUPERVISION_ID.eq(supervisionId))
                .fetch(new SupervisionImageMapper(true));
    }

    public int deleteSupervisionImage(Integer id) {
        return dsl.delete(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.ID.eq(id))
                .execute();
    }

    public int deleteSupervisionImages(Integer supervisionId) {
        return dsl.delete(TableAlias.supervisionImage)
                .where(TableAlias.supervisionImage.SUPERVISION_ID.eq(supervisionId))
                .execute();
    }

}
