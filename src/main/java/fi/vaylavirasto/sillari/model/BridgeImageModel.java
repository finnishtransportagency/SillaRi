package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class BridgeImageModel extends BaseModel {
    private Integer id;
    private Integer bridgeId;
    private String taken;
    private String filename;
    private String objectKey;

    // Used for image file input, and also output for use in the supervision UI when offline
    private String base64;
}
