package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class RouteBridgeModel {
    private Integer id;
    private Integer routeId;
    private Integer bridgeId;
    private String crossingInstruction;
    private List<SupervisionModel> supervisions;
    private Long contractNumber;

    // Parents
    private BridgeModel bridge;
    private RouteModel route;
}
