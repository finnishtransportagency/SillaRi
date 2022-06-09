package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.BridgeImageMapper;
import fi.vaylavirasto.sillari.model.Sequences;
import fi.vaylavirasto.sillari.model.BridgeImageModel;
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
public class BridgeImageRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public Integer insertBridgeImageIfNotExists(BridgeImageModel bridgeImage) {
        Integer existingId = getBridgeImageIdByFilename(bridgeImage.getFilename());

        if (existingId == null || existingId == 0) {
            LocalDateTime taken = DateMapper.stringToLocalDate(bridgeImage.getTaken());

            return dsl.transactionResult(configuration -> {
                DSLContext ctx = DSL.using(configuration);

                Integer imageId = ctx.nextval(Sequences.BRIDGE_IMAGE_ID_SEQ).intValue();
                Record1<Integer> imageIdResult = ctx.insertInto(TableAlias.bridgeImage,
                                TableAlias.bridgeImage.ID,
                                TableAlias.bridgeImage.BRIDGE_ID,
                                TableAlias.bridgeImage.FILENAME,
                                TableAlias.bridgeImage.TAKEN,
                                TableAlias.bridgeImage.OBJECT_KEY)
                        .values(imageId,
                                bridgeImage.getBridgeId(),
                                bridgeImage.getFilename(),
                                taken,
                                bridgeImage.getObjectKey())
                        .returningResult(TableAlias.bridgeImage.ID)
                        .fetchOne(); // Execute and return zero or one record
                return imageIdResult != null ? imageIdResult.value1() : null;
            });
        } else {
            return existingId;
        }
    }

    public BridgeImageModel getBridgeImage(Integer id) {
        return dsl.select().from(TableAlias.bridgeImage)
                .where(TableAlias.bridgeImage.ID.eq(id))
                .fetchOne(new BridgeImageMapper());

    }

    public BridgeImageModel getBridgeImageWithBridgeId(Integer bridgeid) {
        return dsl.select().from(TableAlias.bridgeImage)
                .where(TableAlias.bridgeImage.BRIDGE_ID.eq(bridgeid))
                .fetchOne(new BridgeImageMapper());

    }

    public Integer getBridgeImageIdByFilename(String filename) {
        return dsl.select().from(TableAlias.bridgeImage)
                .where(TableAlias.bridgeImage.FILENAME.eq(filename))
                .fetchOne(TableAlias.bridgeImage.ID);

    }

    public List<BridgeImageModel> getBridgeImages(Integer bridgeId) {
        return dsl.select().from(TableAlias.bridgeImage)
                .where(TableAlias.bridgeImage.BRIDGE_ID.eq(bridgeId))
                .fetch(new BridgeImageMapper());
    }

    public int deleteBridgeImage(Integer id) {
        return dsl.delete(TableAlias.bridgeImage)
                .where(TableAlias.bridgeImage.ID.eq(id))
                .execute();
    }

    public int deleteBridgeImages(Integer bridgeId) {
        return dsl.delete(TableAlias.bridgeImage)
                .where(TableAlias.bridgeImage.BRIDGE_ID.eq(bridgeId))
                .execute();
    }

}

