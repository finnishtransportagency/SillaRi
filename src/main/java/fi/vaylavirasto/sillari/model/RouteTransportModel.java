package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class RouteTransportModel {
    private Integer id;
    private Integer routeId;
    private RouteTransportStatusModel currentStatus;
    private List<RouteTransportStatusModel> statusHistory;
    private List<SupervisionModel> supervisions;
}
