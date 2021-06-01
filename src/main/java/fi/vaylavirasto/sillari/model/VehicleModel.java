package fi.vaylavirasto.sillari.model;
import lombok.Data;

@Data
public class VehicleModel {
    private long id;
    private long permitId;
    private String type;
    private String identifier;
}
