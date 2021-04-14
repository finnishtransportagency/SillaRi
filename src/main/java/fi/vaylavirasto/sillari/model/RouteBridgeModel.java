package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class RouteBridgeModel {
    private long id;
    private long routeId;
    private BridgeModel bridge;
    private String crossingInstruction;
}
