package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class RouteTransportNumberModel extends BaseModel {
    private Integer id;
    private Integer routeId;
    private Integer routeTransportId;
    private Integer transportNumber;
    private boolean used = false;
}
