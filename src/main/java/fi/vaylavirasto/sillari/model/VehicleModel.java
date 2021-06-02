package fi.vaylavirasto.sillari.model;
import lombok.Data;

@Data
public class VehicleModel {
    private Integer id;
    private Integer permitId;
    private String type;
    private String identifier;
}
