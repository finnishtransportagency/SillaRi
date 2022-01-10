package fi.vaylavirasto.sillari.model;
import lombok.Data;

@Data
public class VehicleModel {
    private Integer id;
    private Integer permitId;
    private Integer ordinal;
    private String type;
    private VehicleRole role;
    private String identifier;
}
