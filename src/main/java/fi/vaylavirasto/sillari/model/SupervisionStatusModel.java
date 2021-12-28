package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.OffsetDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
public class SupervisionStatusModel extends BaseModel {
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
