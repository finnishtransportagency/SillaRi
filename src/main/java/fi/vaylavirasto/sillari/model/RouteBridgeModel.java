package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class RouteBridgeModel {
    private Integer id;
    private Integer routeId;
    private Integer bridgeId;
    private String crossingInstruction;
    private SupervisionModel supervision;

    // Parents
    private BridgeModel bridge;
    private RouteModel route;
}
