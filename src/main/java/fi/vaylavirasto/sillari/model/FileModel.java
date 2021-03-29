package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class FileModel {
    private Long id;
    private String filename;
    private String mimetype;
    private String encoding;
}
