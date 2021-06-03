package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class RouteBridgeModel {
    private Integer id;
    private Integer routeId;
    private BridgeModel bridge;
    private String crossingInstruction;
    private SupervisionModel supervision;
}
