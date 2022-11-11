package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.OffsetDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class SupervisionPdfModel extends BaseModel {
    private Integer id;
    private Integer supervisionId;
    private String filename;
    private String objectKey;
    private String ktvObjectId;
    private SupervisionPdfStatusType status;
    private OffsetDateTime statusTime;
    private OffsetDateTime rowCreatedTime;
    private OffsetDateTime rowUpdatedTime;

    public SupervisionPdfModel() {
    }

    public SupervisionPdfModel(Integer supervisionId, String filename) {
        this.supervisionId = supervisionId;
        this.filename = filename;
    }

}
