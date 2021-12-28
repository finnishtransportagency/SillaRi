package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class SupervisionImageModel extends BaseModel {
    private Integer id;
    private Integer supervisionId;
    private String taken;
    private String objectKey;
    private String filename;
    private String mimetype;
    private String encoding;
}
