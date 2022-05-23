package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.OffsetDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class SupervisionReportPdfModel extends BaseModel {
    private Integer id;
    private Integer supervisionReportId;
    private String filename;
    private String objectKey;
    private String ktvObjectId;
    private ReportPdfStatusType status;
    private OffsetDateTime statusTime;
    private OffsetDateTime rowCreatedTime;
    private OffsetDateTime rowUpdatedTime;
}
