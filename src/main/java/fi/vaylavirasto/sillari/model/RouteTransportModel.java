package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class RouteTransportModel {
    private Integer id;
    private Integer routeId;
    private OffsetDateTime plannedDepartureTime;

    private RouteTransportStatusModel currentStatus;
    private List<RouteTransportStatusModel> statusHistory;
    private RouteModel route;
    private List<SupervisionModel> supervisions;
}
