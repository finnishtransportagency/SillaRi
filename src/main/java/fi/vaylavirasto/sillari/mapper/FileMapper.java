package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.FileModel;
import fi.vaylavirasto.sillari.model.Tables;
import fi.vaylavirasto.sillari.model.tables.SupervisionImage;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.time.format.DateTimeFormatter;
import java.util.Base64;

public class FileMapper implements RecordMapper<Record, FileModel> {
    public static final SupervisionImage image = Tables.SUPERVISION_IMAGE.as("sni");
    private boolean base64on;
    public FileMapper() {
        this.base64on=false;
    }
    public FileMapper(boolean base64on) {
        this.base64on=base64on;
    }
    @Nullable
    @Override
    public FileModel map(Record record) {
        FileModel fileModel = new FileModel();
        fileModel.setId(record.get(image.ID));
        fileModel.setSupervisionId(record.get(image.SUPERVISION_ID));
        if(this.base64on) {
            fileModel.setObjectKey(Base64.getEncoder().encodeToString(record.get(image.OBJECT_KEY).getBytes()));
        } else {
            fileModel.setObjectKey(record.get(image.OBJECT_KEY));
        }
        fileModel.setFilename(record.get(image.FILENAME));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        fileModel.setTaken(record.get(image.TAKEN).format(formatter));
        fileModel.setMimetype("");
        fileModel.setEncoding("");
        return fileModel;
    }
}