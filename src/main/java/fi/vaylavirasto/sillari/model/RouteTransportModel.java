package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class RouteTransportModel extends BaseModel {
    private Integer id;
    private Integer routeId;
    private OffsetDateTime plannedDepartureTime;
    private String tractorUnit;

    private RouteTransportStatusModel currentStatus;
    private List<RouteTransportStatusModel> statusHistory;
    private RouteModel route;
    private Integer transportNumber;
    private List<SupervisionModel> supervisions;

    private OffsetDateTime departureTime; // First DEPARTED in statusHistory
    private OffsetDateTime arrivalTime; // First ARRIVED in statusHistory

    // Only returned to the transport company admin UI
    private RouteTransportPasswordModel currentTransportPassword;



    public void setStatusHistory(List<RouteTransportStatusModel> statusHistory) {
        this.statusHistory = statusHistory;

        if (statusHistory != null && !statusHistory.isEmpty()) {
            this.setCurrentStatus(statusHistory);
            this.setStatusTimes(statusHistory);
        }
    }

    private void setCurrentStatus(List<RouteTransportStatusModel> statusHistory) {
        this.currentStatus = statusHistory.stream().max(Comparator.comparing(RouteTransportStatusModel::getTime)).orElse(null);
    }

    private void setStatusTimes(List<RouteTransportStatusModel> statusHistory) {
        OffsetDateTime departureTime = statusHistory.stream()
                .filter(model -> TransportStatusType.DEPARTED.equals(model.getStatus()))
                .min(Comparator.comparing(RouteTransportStatusModel::getTime))
                .map(RouteTransportStatusModel::getTime).orElse(null);

        OffsetDateTime arrivalTime = statusHistory.stream()
                .filter(model -> TransportStatusType.ARRIVED.equals(model.getStatus()))
                .min(Comparator.comparing(RouteTransportStatusModel::getTime))
                .map(RouteTransportStatusModel::getTime).orElse(null);

        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
    }
}
