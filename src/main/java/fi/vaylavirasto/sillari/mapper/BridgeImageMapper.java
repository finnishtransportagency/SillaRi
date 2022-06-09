package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.BridgeImageModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class BridgeImageMapper implements RecordMapper<Record, BridgeImageModel> {

    @Nullable
    @Override
    public BridgeImageModel map(Record record) {
        BridgeImageModel model = new BridgeImageModel();
        model.setId(record.get(TableAlias.bridgeImage.ID));
        model.setBridgeId(record.get(TableAlias.bridgeImage.BRIDGE_ID));

        String objectKey = record.get(TableAlias.bridgeImage.OBJECT_KEY);

        model.setObjectKey(objectKey);

        model.setFilename(record.get(TableAlias.bridgeImage.FILENAME));
        model.setRowCreatedTime(record.get(TableAlias.bridgeImage.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.bridgeImage.ROW_UPDATED_TIME));
        return model;
    }
}

