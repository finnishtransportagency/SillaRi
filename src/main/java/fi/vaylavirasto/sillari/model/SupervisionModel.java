package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class SupervisionModel {
    private Integer id;
    private Integer routeBridgeId;
    private Integer routeTransportId;
    private OffsetDateTime plannedTime;
    private SupervisionStatus status;
    private Boolean conformsToPermit;
    private Integer supervisorId;
}
