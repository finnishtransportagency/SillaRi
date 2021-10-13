package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Comparator;
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

    public void setStatusHistory(List<RouteTransportStatusModel> statusHistory) {
        this.statusHistory = statusHistory;

        if (statusHistory != null && !statusHistory.isEmpty()) {
            this.setCurrentStatus(statusHistory);
        }
    }

    private void setCurrentStatus(List<RouteTransportStatusModel> statusHistory) {
        this.currentStatus = statusHistory.stream().max(Comparator.comparing(RouteTransportStatusModel::getTime)).orElse(null);
    }
}
