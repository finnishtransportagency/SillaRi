package fi.vaylavirasto.sillari.model;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class VehicleModel extends BaseModel {
    private Integer id;
    private Integer permitId;
    private String type;
    private String identifier;
}
