package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.FileModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.time.format.DateTimeFormatter;
import java.util.Base64;

public class FileMapper implements RecordMapper<Record, FileModel> {
    private boolean base64on;

    public FileMapper() {
        this.base64on = false;
    }

    public FileMapper(boolean base64on) {
        this.base64on = base64on;
    }

    @Nullable
    @Override
    public FileModel map(Record record) {
        FileModel fileModel = new FileModel();
        fileModel.setId(record.get(TableAlias.supervisionImage.ID));
        fileModel.setSupervisionId(record.get(TableAlias.supervisionImage.SUPERVISION_ID));
        if (this.base64on) {
            fileModel.setObjectKey(Base64.getEncoder().encodeToString(record.get(TableAlias.supervisionImage.OBJECT_KEY).getBytes()));
        } else {
            fileModel.setObjectKey(record.get(TableAlias.supervisionImage.OBJECT_KEY));
        }
        fileModel.setFilename(record.get(TableAlias.supervisionImage.FILENAME));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        fileModel.setTaken(record.get(TableAlias.supervisionImage.TAKEN).format(formatter));
        fileModel.setMimetype("");
        fileModel.setEncoding("");
        return fileModel;
    }
}
