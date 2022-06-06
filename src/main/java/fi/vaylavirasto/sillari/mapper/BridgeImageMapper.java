package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.BridgeImageModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.time.format.DateTimeFormatter;
import java.util.Base64;

public class BridgeImageMapper implements RecordMapper<Record, BridgeImageModel> {
    private boolean base64on;

    public BridgeImageMapper() {
        this.base64on = false;
    }

    public BridgeImageMapper(boolean base64on) {
        this.base64on = base64on;
    }

    @Nullable
    @Override
    public BridgeImageModel map(Record record) {
        BridgeImageModel model = new BridgeImageModel();
        model.setId(record.get(TableAlias.bridgeImage.ID));
        model.setSupervisionId(record.get(TableAlias.bridgeImage.SUPERVISION_ID));

        String objectKey = record.get(TableAlias.bridgeImage.OBJECT_KEY);
        String objectId = record.get(TableAlias.bridgeImage.KTV_OBJECT_ID);
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
        model.setFilename(record.get(TableAlias.bridgeImage.FILENAME));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        model.setTaken(record.get(TableAlias.bridgeImage.TAKEN).format(formatter));
        model.setRowCreatedTime(record.get(TableAlias.bridgeImage.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.bridgeImage.ROW_UPDATED_TIME));
        return model;
    }
}

