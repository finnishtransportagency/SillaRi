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
    private SupervisionStatusModel currentStatus;
    private List<SupervisionStatusModel> statusHistory;
    private SupervisorType supervisorType;
    private List<SupervisorModel> supervisors;
    private SupervisionReportModel report;
    private List<FileModel> images;

    private OffsetDateTime createdTime; // First PLANNED in statusHistory
    private OffsetDateTime startedTime; // First IN_PROGRESS in statusHistory
    private OffsetDateTime cancelledTime; // First CANCELLED in statusHistory
    private OffsetDateTime finishedTime; // First FINISHED in statusHistory

    public void setStatusTimes(List<SupervisionStatusModel> statusHistory) {
        OffsetDateTime createdTime = statusHistory.stream()
                .filter(model -> SupervisionStatusType.PLANNED.equals(model.getStatus()))
                .min(Comparator.comparing(SupervisionStatusModel::getTime))
                .map(SupervisionStatusModel::getTime).orElse(null);

        OffsetDateTime startedTime = statusHistory.stream()
                .filter(model -> SupervisionStatusType.IN_PROGRESS.equals(model.getStatus()))
                .min(Comparator.comparing(SupervisionStatusModel::getTime))
                .map(SupervisionStatusModel::getTime).orElse(null);

        OffsetDateTime cancelledTime = statusHistory.stream()
                .filter(model -> SupervisionStatusType.CANCELLED.equals(model.getStatus()))
                .min(Comparator.comparing(SupervisionStatusModel::getTime))
                .map(SupervisionStatusModel::getTime).orElse(null);

        OffsetDateTime finishedTime = statusHistory.stream()
                .filter(model -> SupervisionStatusType.FINISHED.equals(model.getStatus()))
                .min(Comparator.comparing(SupervisionStatusModel::getTime))
                .map(SupervisionStatusModel::getTime).orElse(null);

        this.createdTime = createdTime;
        this.startedTime = startedTime;
        this.cancelledTime = cancelledTime;
        this.finishedTime = finishedTime;
    }

}
