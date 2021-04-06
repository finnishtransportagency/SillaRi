package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FileModel {
    private long id;
    private long crossingId;
    private String taken;
    private String objectKey;
    private String filename;
    private String mimetype;
    private String encoding;
}
