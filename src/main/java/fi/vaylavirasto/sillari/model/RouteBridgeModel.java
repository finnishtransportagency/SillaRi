package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class RouteBridgeModel {
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
