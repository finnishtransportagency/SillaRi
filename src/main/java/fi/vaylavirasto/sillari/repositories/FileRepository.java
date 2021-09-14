package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.FileMapper;
import fi.vaylavirasto.sillari.model.FileModel;
import fi.vaylavirasto.sillari.model.Sequences;
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
public class FileRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public Integer insertFileIfNotExists(FileModel fileModel) {
        Integer existingId = getFileIdByObjectKey(fileModel.getObjectKey());
        if (existingId == null || existingId == 0) {
            Integer imageId = dsl.nextval(Sequences.SUPERVISION_IMAGE_ID_SEQ).intValue();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
            LocalDateTime taken = LocalDateTime.parse(fileModel.getTaken(), formatter);
            dsl.insertInto(FileMapper.image,
                            FileMapper.image.ID,
                            FileMapper.image.SUPERVISION_ID,
                            FileMapper.image.FILENAME,
                            FileMapper.image.OBJECT_KEY,
                            FileMapper.image.TAKEN)
                    .select(dsl.select(DSL.val(imageId),
                                    DSL.val(fileModel.getSupervisionId()),
                                    DSL.val(fileModel.getFilename()),
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

    public List<FileModel> getFiles(Integer supervisionId) {
        return dsl.select().from(FileMapper.image).where(FileMapper.image.SUPERVISION_ID.eq(supervisionId))
                .fetch(new FileMapper(true));
    }

    public int deleteFileByObjectKey(String objectKey) {
        return dsl.delete(FileMapper.image)
                .where(FileMapper.image.OBJECT_KEY.eq(objectKey))
                .execute();
    }

}
