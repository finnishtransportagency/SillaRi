package fi.vaylavirasto.sillari.model;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class VehicleModel extends BaseModel {
    private Integer id;
    private Integer permitId;
    private String type;
    private String identifier;
}
