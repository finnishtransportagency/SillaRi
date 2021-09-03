package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class FileModel {
    private Integer id;
    private Integer supervisionId;
    private String taken;
    private String objectKey;
    private String filename;
    private String mimetype;
    private String encoding;
}
