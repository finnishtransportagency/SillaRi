package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.OffsetDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
public class SupervisionReportModel extends BaseModel {
    private Integer id;
    private Integer supervisionId;
    private Boolean drivingLineOk;
    private String drivingLineInfo;
    private Boolean speedLimitOk;
    private String speedLimitInfo;
    private Boolean anomalies;
    private String anomaliesDescription;
    private Boolean surfaceDamage;
    private Boolean jointDamage;
    private Boolean bendOrDisplacement;
    private Boolean otherObservations;
    private String otherObservationsInfo;
    private String additionalInfo;
    private Boolean draft;
}
