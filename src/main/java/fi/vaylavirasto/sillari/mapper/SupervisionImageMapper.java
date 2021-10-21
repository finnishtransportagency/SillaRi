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
        SupervisionImageModel supervisionImageModel = new SupervisionImageModel();
        supervisionImageModel.setId(record.get(TableAlias.supervisionImage.ID));
        supervisionImageModel.setSupervisionId(record.get(TableAlias.supervisionImage.SUPERVISION_ID));
        if (this.base64on) {
            supervisionImageModel.setObjectKey(Base64.getEncoder().encodeToString(record.get(TableAlias.supervisionImage.OBJECT_KEY).getBytes()));
        } else {
            supervisionImageModel.setObjectKey(record.get(TableAlias.supervisionImage.OBJECT_KEY));
        }
        supervisionImageModel.setFilename(record.get(TableAlias.supervisionImage.FILENAME));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        supervisionImageModel.setTaken(record.get(TableAlias.supervisionImage.TAKEN).format(formatter));
        supervisionImageModel.setMimetype("");
        supervisionImageModel.setEncoding("");
        return supervisionImageModel;
    }
}
