package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.dto.CoordinatesDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class BridgeModel extends BaseModel {
    private Integer id;
    private String oid;
    private String identifier;
    private String name;
    private String roadAddress;
    private String municipality;
    private String geojson;
    private String status;
    private List<RouteBridgeModel> routeBridges;
    private CoordinatesDTO coordinates; // Coordinates in TREX format
}
