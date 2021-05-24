package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class SupervisionModel {
    private Integer id;
    private Integer routeBridgeId;
    private Integer routeTransportId;
    private OffsetDateTime plannedTime;
    private Boolean conformsToPermit;
    private SupervisionStatusModel currentStatus;
    private List<SupervisionStatusModel> statusHistory;
}
