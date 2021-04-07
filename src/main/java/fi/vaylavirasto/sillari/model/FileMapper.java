package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Crossing;
import fi.vaylavirasto.sillari.model.tables.CrossingImage;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.time.format.DateTimeFormatter;

public class FileMapper implements RecordMapper<Record, FileModel> {
    public static final CrossingImage image = Tables.CROSSING_IMAGE.as("i");
    @Nullable
    @Override
    public FileModel map(Record record) {
        FileModel fileModel = new FileModel();
        fileModel.setId(record.get(image.ID));
        fileModel.setCrossingId(record.get(image.CROSSING_ID));
        fileModel.setObjectKey(record.get(image.OBJECT_KEY));
        fileModel.setFilename(record.get(image.FILENAME));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
        fileModel.setTaken(record.get(image.TAKEN).format(formatter));
        fileModel.setMimetype("");
        fileModel.setEncoding("");
        return fileModel;
    }
}
