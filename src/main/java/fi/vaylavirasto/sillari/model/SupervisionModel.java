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
public class SupervisionModel extends BaseModel {
    private Integer id;
    private Integer routeBridgeId;
    private Integer routeTransportId;
    private OffsetDateTime plannedTime;
    private Boolean conformsToPermit;
    private SupervisorType supervisorType;
    private SupervisionStatusModel currentStatus;
    private List<SupervisionStatusModel> statusHistory;
    private List<SupervisorModel> supervisors;
    private SupervisionReportModel report;
    private List<SupervisionImageModel> images;

    private OffsetDateTime startedTime; // Latest IN_PROGRESS in statusHistory (because might have been started and cancelled and started again)
    private OffsetDateTime crossingDeniedTime; // First (and only) CROSSING_DENIED in statusHistory
    private OffsetDateTime finishedTime; // First (and only) FINISHED in statusHistory

    // Parents
    private RouteBridgeModel routeBridge;
    private RouteTransportModel routeTransport;

    public void setStatusHistory(List<SupervisionStatusModel> statusHistory) {
        this.statusHistory = statusHistory;

        if (statusHistory != null && !statusHistory.isEmpty()) {
            this.setCurrentStatus(statusHistory);
            this.setStatusTimes(statusHistory);
        }
    }

    private void setCurrentStatus(List<SupervisionStatusModel> statusHistory) {
        this.currentStatus = statusHistory.stream().max(Comparator.comparing(SupervisionStatusModel::getTime)).orElse(null);
    }

    private void setStatusTimes(List<SupervisionStatusModel> statusHistory) {
        OffsetDateTime startedTime = statusHistory.stream()
                .filter(model -> SupervisionStatusType.IN_PROGRESS.equals(model.getStatus()))
                .max(Comparator.comparing(SupervisionStatusModel::getTime))
                .map(SupervisionStatusModel::getTime).orElse(null);

        OffsetDateTime crossingDeniedTime = statusHistory.stream()
                .filter(model -> SupervisionStatusType.CROSSING_DENIED.equals(model.getStatus()))
                .min(Comparator.comparing(SupervisionStatusModel::getTime))
                .map(SupervisionStatusModel::getTime).orElse(null);

        OffsetDateTime finishedTime = statusHistory.stream()
                .filter(model -> SupervisionStatusType.FINISHED.equals(model.getStatus()))
                .min(Comparator.comparing(SupervisionStatusModel::getTime))
                .map(SupervisionStatusModel::getTime).orElse(null);

        this.startedTime = startedTime;
        this.crossingDeniedTime = crossingDeniedTime;
        this.finishedTime = finishedTime;
    }

}
