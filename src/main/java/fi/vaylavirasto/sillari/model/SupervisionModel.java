package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class SupervisionModel {
    private Integer id;
    private Integer routeBridgeId;
    private Integer routeTransportId;
    private Integer supervisorId;
    private OffsetDateTime plannedTime;
    private Boolean conformsToPermit;
    // TODO supervisor
    private SupervisionStatusModel currentStatus;
    private List<SupervisionStatusModel> statusHistory;
    private SupervisionReportModel report;
    private List<FileModel> images;

    private SupervisionStatusTimesDTO statusTimes; // Status timestamps mapped from status history

}
