package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;

@Data
public class SupervisionStatusTimesDTO {
    private OffsetDateTime createdTime; // First PLANNED
    private OffsetDateTime startedTime; // First IN_PROGRESS
    private OffsetDateTime cancelledTime; // Last or only CANCELLED
    private OffsetDateTime finishedTime; // Last or only FINISHED

    public SupervisionStatusTimesDTO() {
    }

    // Map status times from status history
    public SupervisionStatusTimesDTO(List<SupervisionStatusModel> statusHistory) {
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
                .max(Comparator.comparing(SupervisionStatusModel::getTime))
                .map(SupervisionStatusModel::getTime).orElse(null);

        OffsetDateTime finishedTime = statusHistory.stream()
                .filter(model -> SupervisionStatusType.FINISHED.equals(model.getStatus()))
                .max(Comparator.comparing(SupervisionStatusModel::getTime))
                .map(SupervisionStatusModel::getTime).orElse(null);

        this.createdTime = createdTime;
        this.startedTime = startedTime;
        this.cancelledTime = cancelledTime;
        this.finishedTime = finishedTime;
    }

}
