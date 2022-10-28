package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.OffsetDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class SupervisionReportModel extends BaseModel {
    private Integer id;
    private Integer supervisionId;
    private Boolean drivingLineOk = false;
    private String drivingLineInfo;
    private Boolean speedLimitOk = false;;
    private String speedLimitInfo;
    private Boolean anomalies = true;
    private String anomaliesDescription;
    private Boolean surfaceDamage = false;;
    private Boolean jointDamage = false;;
    private Boolean bendOrDisplacement = false;;
    private Boolean otherObservations = false;;
    private String otherObservationsInfo;
    private String additionalInfo;
    private Boolean draft = true;

    // Not in database, only here since RequestBody and RequestParam can't be used together in SupervisionController
    private OffsetDateTime startTime;
}
