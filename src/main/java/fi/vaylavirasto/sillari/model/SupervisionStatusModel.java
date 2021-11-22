package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class SupervisionStatusModel {
    private Integer id;
    private Integer supervisionId;
    private SupervisionStatusType status;
    private OffsetDateTime time;
    private String reason;
    private String username;

    public SupervisionStatusModel() {
    }

    public SupervisionStatusModel(Integer supervisionId, SupervisionStatusType status, OffsetDateTime time, String username) {
        this.supervisionId = supervisionId;
        this.status = status;
        this.time = time;
        this.username = username;
    }

    public SupervisionStatusModel(Integer supervisionId, SupervisionStatusType status, OffsetDateTime time, String reason, String username) {
        this.supervisionId = supervisionId;
        this.status = status;
        this.time = time;
        this.reason = reason;
        this.username = username;
    }
}
