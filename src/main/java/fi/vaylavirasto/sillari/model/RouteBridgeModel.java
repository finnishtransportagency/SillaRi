package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class RouteBridgeModel extends BaseModel {
    private Integer id;
    private Integer routeId;
    private Integer bridgeId;
    private Integer ordinal;
    private String crossingInstruction;
    private Long contractNumber;
    private List<SupervisionModel> supervisions;

    // Parents
    private BridgeModel bridge;
    private RouteModel route;
}
