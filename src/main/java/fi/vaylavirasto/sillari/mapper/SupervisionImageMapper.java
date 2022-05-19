package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.SupervisionImageModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.time.format.DateTimeFormatter;
import java.util.Base64;

public class SupervisionImageMapper implements RecordMapper<Record, SupervisionImageModel> {
    private boolean base64on;

    public SupervisionImageMapper() {
        this.base64on = false;
    }

    public SupervisionImageMapper(boolean base64on) {
        this.base64on = base64on;
    }

    @Nullable
    @Override
    public SupervisionImageModel map(Record record) {
        SupervisionImageModel model = new SupervisionImageModel();
        model.setId(record.get(TableAlias.supervisionImage.ID));
        model.setSupervisionId(record.get(TableAlias.supervisionImage.SUPERVISION_ID));

        String objectKey = record.get(TableAlias.supervisionImage.OBJECT_KEY);
        String objectId = record.get(TableAlias.supervisionImage.KTV_OBJECT_ID);
        if (this.base64on) {
            if (objectKey != null) {
                model.setObjectKey(Base64.getEncoder().encodeToString(objectKey.getBytes()));
            }
            if (objectId != null) {
                model.setKtvObjectId(Base64.getEncoder().encodeToString(objectId.getBytes()));
            }
        } else {
            model.setObjectKey(objectKey);
            model.setKtvObjectId(objectId);
        }
        model.setFilename(record.get(TableAlias.supervisionImage.FILENAME));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        model.setTaken(record.get(TableAlias.supervisionImage.TAKEN).format(formatter));
        model.setRowCreatedTime(record.get(TableAlias.supervisionImage.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.supervisionImage.ROW_UPDATED_TIME));
        return model;
    }
}
