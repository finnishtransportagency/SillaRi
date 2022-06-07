package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.BridgeImageModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.time.format.DateTimeFormatter;
import java.util.Base64;

public class BridgeImageMapper implements RecordMapper<Record, BridgeImageModel> {
    private final boolean base64on;

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
        model.setBridgeId(record.get(TableAlias.bridgeImage.BRIDGE_ID));

        String objectKey = record.get(TableAlias.bridgeImage.OBJECT_KEY);
        if (this.base64on) {
            if (objectKey != null) {
                model.setObjectKey(Base64.getEncoder().encodeToString(objectKey.getBytes()));
            }
        } else {
            model.setObjectKey(objectKey);
        }
        model.setFilename(record.get(TableAlias.bridgeImage.FILENAME));
        model.setRowCreatedTime(record.get(TableAlias.bridgeImage.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.bridgeImage.ROW_UPDATED_TIME));
        return model;
    }
}

