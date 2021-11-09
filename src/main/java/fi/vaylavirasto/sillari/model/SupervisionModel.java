package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;

@Data
public class SupervisionModel {
    private Integer id;
    private Integer routeBridgeId;
    private Integer routeTransportId;
    private OffsetDateTime plannedTime;
    private Boolean conformsToPermit;
    private SupervisorType supervisorType;
    private String denyCrossingReason;
    private SupervisionStatusModel currentStatus;
    private List<SupervisionStatusModel> statusHistory;
    private List<SupervisorModel> supervisors;
    private SupervisionReportModel report;
    private List<SupervisionImageModel> images;

    private OffsetDateTime startedTime; // First IN_PROGRESS in statusHistory
    private OffsetDateTime crossingDeniedTime; // First CROSSING_DENIED in statusHistory
    private OffsetDateTime finishedTime; // First FINISHED in statusHistory

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
                .min(Comparator.comparing(SupervisionStatusModel::getTime))
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
