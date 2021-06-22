package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class FileInputModel {
    private String crossingId;
    private String filename;
    private String base64;
    private String taken;
}
