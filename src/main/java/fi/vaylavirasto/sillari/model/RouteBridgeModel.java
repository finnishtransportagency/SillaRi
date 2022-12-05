package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.ArrayList;
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
    private String contractBusinessId;
    private Integer transportNumber;
    private List<SupervisionModel> supervisions = new ArrayList<>();
    private Boolean maxTransportsExceeded = false;
    private String photoDataUrl;

    // Parents
    private BridgeModel bridge;
    private RouteModel route;

    public RouteBridgeModel() {
    }

    public RouteBridgeModel(RouteBridgeModel from, Integer transportNumber ) {
        this.transportNumber = transportNumber;

        this.routeId = from.getRouteId();
        this.bridgeId = from.getBridgeId();
        this.ordinal = from.getOrdinal();
        this.crossingInstruction = from.getCrossingInstruction();
        this.contractNumber = from.getContractNumber();
        this.contractBusinessId = from.getContractBusinessId();
        this.supervisions = from.getSupervisions();
        this.bridge = from.getBridge();
        this.route = from.getRoute();
        this.photoDataUrl = from.getPhotoDataUrl();
    }
}
